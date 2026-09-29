import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Plus, X, Save, Trash2 } from "lucide-react";
import { useModal } from "../Hooks/useModal";
export type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};
export default function UserManager({
    users,
    currentUserId,
}: {
    users: AdminUser[];
    currentUserId: number;
}) {
    const [editing, setEditing] = useState<AdminUser | null | undefined>();
    return (
        <>
            <div className="panel table-wrap">
                <div className="row-between">
                    <div>
                        <h3>Administrator access</h3>
                        <p className="muted">
                            Editors manage content. Super administrators also
                            manage settings and access.
                        </p>
                    </div>
                    <button
                        className="button blue-button small"
                        onClick={() => setEditing(null)}
                    >
                        <Plus size={16} />
                        Add administrator
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    {u.name}
                                    {u.id === currentUserId ? " (you)" : ""}
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span className="badge">
                                        {u.role.replace("_", " ")}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="text-link"
                                        onClick={() => setEditing(u)}
                                    >
                                        Manage access
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editing !== undefined && (
                <UserEditor
                    user={editing}
                    currentUserId={currentUserId}
                    close={() => setEditing(undefined)}
                />
            )}
        </>
    );
}
function UserEditor({
    user,
    currentUserId,
    close,
}: {
    user: AdminUser | null;
    currentUserId: number;
    close: () => void;
}) {
    useModal(close);
    const f = useForm({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "editor",
        password: "",
        password_confirmation: "",
    });
    return (
        <div className="modal-backdrop">
            <section
                className="modal lead-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-title"
            >
                <div className="modal-heading">
                    <h2 id="user-title">
                        {user ? "Manage administrator" : "Add administrator"}
                    </h2>
                    <button
                        className="icon-button"
                        onClick={close}
                        aria-label="Close"
                    >
                        <X />
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        user
                            ? f.put("/admin/users/" + user.id, {
                                  onSuccess: close,
                              })
                            : f.post("/admin/users", { onSuccess: close });
                    }}
                >
                    <label>
                        Name
                        <input
                            required
                            value={f.data.name}
                            onChange={(e) => f.setData("name", e.target.value)}
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            required
                            value={f.data.email}
                            onChange={(e) => f.setData("email", e.target.value)}
                        />
                    </label>
                    <label>
                        Role
                        <select
                            value={f.data.role}
                            disabled={user?.id === currentUserId}
                            onChange={(e) => f.setData("role", e.target.value)}
                        >
                            <option value="editor">Content editor</option>
                            <option value="super_admin">
                                Super administrator
                            </option>
                        </select>
                    </label>
                    <label>
                        {user
                            ? "New password (leave blank to keep current)"
                            : "Password"}
                        <input
                            type="password"
                            autoComplete="new-password"
                            required={!user}
                            minLength={12}
                            value={f.data.password}
                            onChange={(e) =>
                                f.setData("password", e.target.value)
                            }
                        />
                    </label>
                    <label>
                        Confirm password
                        <input
                            type="password"
                            autoComplete="new-password"
                            required={!!f.data.password}
                            value={f.data.password_confirmation}
                            onChange={(e) =>
                                f.setData(
                                    "password_confirmation",
                                    e.target.value,
                                )
                            }
                        />
                    </label>
                    {Object.values(f.errors).map((e) => (
                        <p className="error" role="alert" key={e}>
                            {e}
                        </p>
                    ))}
                    <div className="modal-actions">
                        {user && user.id !== currentUserId && (
                            <button
                                type="button"
                                className="button danger"
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Remove this administrator and revoke their access?",
                                        )
                                    )
                                        router.delete(
                                            "/admin/users/" + user.id,
                                            { onSuccess: close },
                                        );
                                }}
                            >
                                <Trash2 size={15} />
                                Remove
                            </button>
                        )}
                        <button
                            type="button"
                            className="button outline"
                            onClick={close}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={f.processing}
                            className="button blue-button"
                        >
                            <Save size={16} />
                            Save account
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
