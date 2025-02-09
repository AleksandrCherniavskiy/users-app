import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
  ],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'age', 'address'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  ngAfterViewInit(): void {
    // Assign sort and paginator after view initialization.
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Set a custom filter predicate to search only by first and last names.
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const lowerFilter = filter.trim().toLowerCase();
      return (
        data.firstName.toLowerCase().includes(lowerFilter) ||
        data.lastName.toLowerCase().includes(lowerFilter)
      );
    };
  }

  // Fetch users from the API and assign them to the dataSource.
  fetchUsers(): void {
    this.http
      .get<{
        users: User[];
      }>(
        'https://dummyjson.com/users?limit=0&select=id,firstName,lastName,age,address'
      )
      .subscribe((response) => {
        // Update the data source's data property.
        this.dataSource.data = response.users;
      });
  }

  // Filter the table using the built-in filter mechanism.
  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue;
    // If pagination is active, reset to the first page when the filter changes.
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
