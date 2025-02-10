import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../models/user/user.model';

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
    ReactiveFormsModule,
  ],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'age', 'address'];
  dataSource = new MatTableDataSource<User>();

  searchControl: FormControl = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService) {
    this.usersService
      .getUsers()
      .pipe(takeUntilDestroyed())
      .subscribe((users) => {
        this.dataSource.data = users;
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
      const lowerFilter = filter.trim().toLowerCase();
      return (
        data.firstName.toLowerCase().includes(lowerFilter) ||
        data.lastName.toLowerCase().includes(lowerFilter)
      );
    };
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
