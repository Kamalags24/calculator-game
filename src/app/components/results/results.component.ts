import { Component, OnInit } from '@angular/core';
import { Sequence } from '../../models/sequence';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  sequences: Sequence[] = [];
  selectedSequence: Sequence | null = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.sequences = this.storageService.getSequences();
  }

  showHistory(sequence: Sequence): void {
    this.selectedSequence = sequence;
  }
}
