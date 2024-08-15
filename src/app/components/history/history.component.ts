import { Component, Input } from '@angular/core';
import { Sequence } from '../../models/sequence';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  @Input() sequence: Sequence | null = null;
}
