import Time from "../models/Time";

export type FindAllCallback = (error: Error, times: Time[]) => void;

export default interface TimesRepository {
  findAll(): Promise<Time[]>;
  findById(id: number): Promise<Time>;
  update(time: Time): Promise<void>;
  save(times: Time[]): Promise<void>;
}
