import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokeService } from '../poke.service'
@Component({
  selector: 'app-poking-list',
  templateUrl: './poking-list.component.html',
  styleUrls: ['./poking-list.component.css']
})
export class PokingListComponent implements OnInit {

  constructor(
    public pokeService: PokeService,
  ) {}
  ngOnInit() {
    this.pokeService.updatePoking();
  }


}
