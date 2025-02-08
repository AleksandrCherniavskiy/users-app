import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

// Define the User interface (adjust as needed)
interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  address: {
    address: string;
    city: string;
  };
}

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent {
  // Signals for reactive state
  rawUsers = signal<User[]>([]);
  searchTerm = signal<string>('');
  sortColumn = signal<'firstName' | 'lastName' | 'age' | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  pageIndex = signal(0);
  pageSize = signal(10);

  // Compute filtered and sorted users
  filteredUsers = computed(() => {
    let users = this.rawUsers();
    const term = this.searchTerm().toLowerCase();
    const sortKey = this.sortColumn();

    if (term) {
      users = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term)
      );
    }

    if (!sortKey) {
      return users;
    }

    users = [...users].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      if (aValue < bValue) {
        return this.sortDirection() === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection() === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return users;
  });

  // Paginate the filtered list
  paginatedUsers = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  // Columns to display in the table
  displayedColumns = ['firstName', 'lastName', 'age', 'address'];

  // Inject HttpClient for API calls
  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  // Fetch all users from the API (client-side filtering, sorting, and pagination)
  fetchUsers(): void {
    this.http
      .get<{
        users: User[];
      }>('https://dummyjson.com/users?limit=0&select=id,firstName,lastName,age,address')
      .subscribe((response) => {
        this.rawUsers.set(response.users);
      });
    //  .get<{ users: User[] }>('https://dummyjson.com/users?limit=100')
  }

  // Update search term
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.pageIndex.set(0); // reset to first page
  }

  // Handle sorting
  onSort(column: 'firstName' | 'lastName' | 'age'): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  // Handle paginator events
  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
