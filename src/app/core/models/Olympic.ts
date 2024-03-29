import {iParticipation} from "./Participation";

export interface iOlympic
{
    id: number,
    country: string,
    participations: iParticipation[]
}

