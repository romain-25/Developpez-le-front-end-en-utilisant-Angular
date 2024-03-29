export class LineData{
  constructor(public name: string, public series: LineDataSerie[]) {}
}
export class LineDataSerie {
  constructor(public name: string, public value: number) {}
}

