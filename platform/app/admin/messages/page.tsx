"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { ContactStatus } from "@prisma/client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  repliedAt: string | null;
  repliedBy: string | null;
  notes: string | null;
}

interface MessagesResponse {
  messages: ContactMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  counts: Record<string, number>;
}

const STATUS_COLORS: Record<ContactStatus, string> = {
  UNREAD: "bg-red-500",
  READ: "bg-blue-500",
  REPLIED: "bg-green-500",
  ARCHIVED: "bg-gray-500",
  SPAM: "bg-yellow-500",
};

const STATUS_LABELS: Record<ContactStatus, string> = {
  UNREAD: "Unread",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
  SPAM: "Spam",
};

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [updating, setUpdating] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const fetchMessages = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (statusFilter) params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  useEffect(() => {
    const user = session?.user as { isAdmin?: boolean } | undefined;
    if (status === "authenticated" && user?.isAdmin) {
      fetchMessages();
    } else if (status === "unauthenticated") {
      setLoading(false);
    } else if (status === "authenticated" && !user?.isAdmin) {
      setLoading(false);
      setError("Unauthorized - Admin access required");
    }
  }, [status, session, fetchMessages]);

  async function updateMessageStatus(id: string, newStatus: ContactStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");

      // Update local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === id ? { ...m, status: newStatus } : m
          ),
        };
      });
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdating(false);
    }
  }

  async function updateMessageNotes(id: string, notes: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === id ? { ...m, notes } : m
          ),
        };
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdating(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.filter((m) => m.id !== id),
          pagination: { ...prev.pagination, total: prev.pagination.total - 1 },
        };
      });
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Admin Access Required</h1>
          <button
            onClick={() => signIn()}
            className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 animate-pulse">Loading messages…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  const user = session?.user as { isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-gray-400">You don&apos;t have admin access.</p>
          <Link
            href="/"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{selectedMessage.name}</h2>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-violet-400 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full text-white ${STATUS_COLORS[selectedMessage.status]}`}
                >
                  {STATUS_LABELS[selectedMessage.status]}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedMessage.subject && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Subject</label>
                  <div className="text-sm mt-1">{selectedMessage.subject}</div>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 uppercase">Message</label>
                <div className="bg-gray-800 rounded-xl p-4 text-sm mt-1 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Notes</label>
                <textarea
                  defaultValue={selectedMessage.notes ?? ""}
                  onBlur={(e) =>
                    e.target.value !== (selectedMessage.notes ?? "") &&
                    updateMessageNotes(selectedMessage.id, e.target.value)
                  }
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm mt-1 focus:border-violet-500 outline-none resize-none"
                  placeholder="Add internal notes..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex flex-wrap gap-2">
              {Object.values(ContactStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => updateMessageStatus(selectedMessage.id, status)}
                  disabled={updating || selectedMessage.status === status}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedMessage.status === status
                      ? "bg-gray-700 text-gray-400 cursor-default"
                      : STATUS_COLORS[status] + " hover:opacity-90 text-white"
                  }`}
                >
                  Mark {STATUS_LABELS[status]}
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Contact Messages</h1>
            <p className="text-gray-500 text-sm mt-1">
              {data?.pagination.total ?? 0} total messages
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ContactStatus | "");
              setPage(1);
            }}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-violet-500 outline-none"
          >
            <option value="">All Status</option>
            {Object.values(ContactStatus).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]} ({data?.counts[s] ?? 0})
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search messages..."
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-violet-500 outline-none flex-1 min-w-[200px]"
          />

          <button
            onClick={() => fetchMessages()}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Messages List */}
        {data?.messages.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-dashed border-gray-800 rounded-2xl">
            <div className="text-4xl mb-3">📭</div>
            <h2 className="text-lg font-semibold mb-2">No messages found</h2>
            <p className="text-gray-500 text-sm">
              {statusFilter || searchQuery
                ? "Try adjusting your filters"
                : "No contact messages yet"}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    From
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Subject
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data?.messages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[message.status]}`}
                        title={STATUS_LABELS[message.status]}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm">{message.name}</div>
                      <div className="text-xs text-gray-500">{message.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm truncate max-w-xs">
                        {message.subject ?? "(no subject)"}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {message.message.slice(0, 60)}...
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {message.status === ContactStatus.UNREAD && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateMessageStatus(message.id, ContactStatus.READ);
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300"
                            disabled={updating}
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message.id);
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-xl text-sm transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-xl text-sm transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
