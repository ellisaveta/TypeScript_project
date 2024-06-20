import { HttpService } from "./http";

export interface InputActorModel {
  name?: string;
  gender?: string;
  bio?: string;
  picture?: string;
}

export interface ActorModel {
  id: number;
  name: string;
  gender: string;
  bio?: string;
  picture?: string;
}

interface GetActorsResponse {
  actors: ActorModel[];
  total: number;
}

class ActorsService {
  private http = new HttpService();

  async getById(actorId: number) {
    const body = await this.http.get<{ actor: ActorModel }>(
      `/actors/${actorId}`
    );

    return body.actor;
  }

  async getActors(searchText?: string) {
    const body = await this.http.get<GetActorsResponse>("/actors", {
      query: {
        searchText: searchText ? searchText : "",
      },
    });
    return body.actors;
  }

  async addActor(input: InputActorModel) {
    const body = await this.http.post<ActorModel>("/actors", { body: input });
    return body;
  }
}

export const actorsService = new ActorsService();
