import { Tag } from "common/types/tags.ts"
import { inferType } from "datex-core-legacy/datex_all.ts";
import { Project } from "common/types/projects.ts";

export const User = struct("User",
    class{
        @property username!: string
        @property email!: string
        @property password!: string
        @property tags!: Tag[];
        @property projects!: Project[];

        

        countProjects() {
			return this.projects.length;
		}


        //spÃ¤tere funktionen
    }
);

export type User = inferType<typeof User>