import { Marker } from 'src/modules/markers/entities/marker.entity';
export class CreateBookmarkResponse {
  bookmark: number;
  marker: Marker; // Replace with the actual type if needed
  nickname: string;

  constructor(bookmark: number, marker: Marker, nickname: string) {
    this.bookmark = bookmark;
    this.marker = marker;
    this.nickname = nickname;
  }
}
