import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { GROUP_BY } from '../../consts';
import { UsersStore } from '../../stores/users.store';
import { UserItemComponent } from '../user-item/user-item.component';
import { UserListControlsComponent } from '../user-list-controls/user-list-controls.component';
import { UserListGroupComponent } from '../user-list-group/user-list-group.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [
    UserItemComponent,
    UserListGroupComponent,
    ScrollingModule,
    UserListControlsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  public usersStore = inject(UsersStore);
  public isLoading = input<boolean>(false);
  public prevOnClicked = output<void>();
  public nextOnClicked = output<void>();

  public readonly header = computed(() => {
    if (this.usersStore.groupBy() === GROUP_BY.ALPHABET) {
      return 'Grouped alphabetically';
    } else if (this.usersStore.groupBy() === GROUP_BY.NATIONALITY) {
      return 'Grouped by nationality';
    } else if (this.usersStore.groupBy() === GROUP_BY.AGE_RANGE) {
      return 'Grouped by age range';
    }
    return 'All users';
  });

  public selectedValues: WritableSignal<{
    groupBy?: GROUP_BY;
    search?: string;
  }> = signal({});

  public selectedValueChanged({
    search,
    groupBy,
  }: {
    search: string;
    groupBy: GROUP_BY;
  }): void {
    this.usersStore.searchTerm.set(search?.toLowerCase());
    this.usersStore.groupBy.set(groupBy);
  }
}
