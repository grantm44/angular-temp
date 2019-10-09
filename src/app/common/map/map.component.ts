import { Component, OnInit, Input } from '@angular/core';
import {MapService } from './map.service';
import { ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  lat: number;
  lng: number;

  @Input() location: string;
  isPositionError: boolean= false;

  constructor(private mapService: MapService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  mapReadyHandler() {
    
      this.mapService.getGeoLocation(this.location).subscribe((coordinates)=> {
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
        this.ref.detectChanges();
        
      }, () => {
        this.isPositionError = true;
      });
  }

}
