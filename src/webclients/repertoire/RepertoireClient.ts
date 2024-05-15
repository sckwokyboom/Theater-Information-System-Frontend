import {BaseClient} from "../BaseCllient.ts";
import {Repertoire} from "./Repertoire.ts";
import {FilterRepertoireCriteria} from "./FilterRepertoireCriteria.ts";

export class RepertoireClient extends BaseClient<Repertoire, FilterRepertoireCriteria> {
    override constructFilterQueryPart(_: FilterRepertoireCriteria): string {
        return "";
    }
}