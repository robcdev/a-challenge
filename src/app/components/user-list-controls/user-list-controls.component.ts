import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GROUP_BY } from '../../consts';
import { UsersGroups } from '../../models/user.model';
import { UsersStore } from '../../stores/users.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list-controls',
  standalone: true,
  imports: [ReactiveFormsModule, PaginatorComponent],
  templateUrl: './user-list-controls.component.html',
  styleUrl: './user-list-controls.component.scss',
})
export class UserListControlsComponent implements OnInit {
  public formBuilder = inject(FormBuilder);
  public usersStore = inject(UsersStore);
  public router = inject(Router);
  public selectedGroup = input();
  public isLoading = input<boolean>(false);
  public destroyRef = inject(DestroyRef);
  public userGroups = input<UsersGroups | null>();
  public valuesChanged = output<{ search: string; groupBy: GROUP_BY }>();
  public nextOnClicked = output<void>();
  public prevOnClicked = output<void>();
  public searchForm: FormGroup = this.formBuilder.group({
    search: [''],
    groupBy: [''],
  });

  public readonly groupByOptions = computed(() => {
    return [
      { value: GROUP_BY.ALPHABET, label: 'Alphabet' },
      { value: GROUP_BY.NATIONALITY, label: 'Nationality' },
      { value: GROUP_BY.AGE_RANGE, label: 'Age Range' },
    ];
  });

  public readonly isUserGroupsLoading = computed(() => !this.userGroups());
  private toastr = inject(ToastrService);
  constructor() {
    effect(() => {
      if (this.isUserGroupsLoading()) {
        this.searchForm.get('search')?.disable();
        this.searchForm.get('groupBy')?.disable();
      } else {
        this.searchForm.get('search')?.enable();
        this.searchForm.get('groupBy')?.enable();
      }
    });
  }

  public ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: { search: string; groupBy: GROUP_BY }) => {
        this.valuesChanged.emit({
          search: changes.search,
          groupBy: changes.groupBy,
        });
      });
  }

  public clearForm(): void {
    this.searchForm.patchValue({ search: '', groupBy: '' });
    this.toastr.success('Cleared!');
  }

  public nextClicked(): void {
    this.nextOnClicked.emit();
  }
  public prevClicked(): void {
    this.prevOnClicked.emit();
  }
}
