import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Observable, of } from "rxjs";
import { BankAccountsService } from "../bank-accounts/bank-accounts.service";
import { CreateEdcRequestDto, ListEdcRequestDto, UpdateEdcRequestDto } from "./dto/edc.dto";
import { EdcModel } from "./entities/edc.entity";
import { Edc } from "./types/edc.types";

@Injectable()
export class EdcService {
  constructor(
    @InjectModel(EdcModel)
    private readonly edcRepository: typeof EdcModel,
    private readonly bankAccountsService: BankAccountsService,
  ) { }

  create(edcData: CreateEdcRequestDto): Observable<Edc> {
    return of(null);
  }

  update(edcId: string, edcData: UpdateEdcRequestDto): Observable<Edc> {
    return of(null);
  }

  delete(edcId: string): Observable<Edc> {
    return of(null);
  }

  get(edcId: string): Observable<Edc> {
    return of(null);
  }

  list(query: ListEdcRequestDto): Observable<Edc[]> {
    return of(null);
  }

  totalRows(query: ListEdcRequestDto): Observable<number> {
    return of(null);
  }
}
