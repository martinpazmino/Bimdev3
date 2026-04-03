import * as React from "react"
import { User, mockUsers } from "../classes/User"
import { UserCard } from "./UserCard"
import { SearchBox } from "./SearchBox"

export function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers)

  const onUserSearch = (value: string) => {
    const filtered = mockUsers.filter((user) => {
      const query = value.toLowerCase()
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.projectName.toLowerCase().includes(query)
      )
    })
    setUsers(filtered)
  }

  const userCards = users.map((user) => (
    <UserCard key={user.id} user={user} />
  ))

  return (
    <div className="page" id="users-page" style={{ display: "flex" }}>
      <header>
        <h2>Users</h2>
        <SearchBox onChange={(value) => onUserSearch(value)} />
        <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
          <p style={{ color: "#969696", fontSize: 14 }}>
            {users.length} member{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>
      {users.length > 0 ? (
        <div id="users-list">{userCards}</div>
      ) : (
        <p style={{ padding: "20px 40px" }}>No users found.</p>
      )}
    </div>
  )
}
