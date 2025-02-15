import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UsersService } from '../services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../models/user/user.model';
import { of } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'age', 'address'];
  dataSource = new MatTableDataSource<User>();
  searchControl: FormControl = new FormControl('');
  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService) {
    this.usersService
      .getUsers()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (users) => {
          this.dataSource.data = users;
          // this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          // this.isLoading = false;
          return of([]);
        },
      });
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.onSearch(value);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return (
        data.firstName.toLowerCase().includes(filter) ||
        data.lastName.toLowerCase().includes(filter)
      );
    };
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
