import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import { Token } from "../../../helper/jsontoken";
import { Sorted } from "../../../helper/type.helper";
import Classroom from "../../../models/classroom";

export const getLimit = async (req: Request, res: Response) => {
  const sorted = req.query.sorted as string;
  const flow = (req.query.flow as string) === "desc" ? -1 : 1;
  const limit = Number.parseInt(req.query.limit as string);

  let sort: Sorted | undefined = undefined;
  if (!!sorted) {
    sort = { [sorted]: flow };
  }

  const classroom = new Classroom();
  const data = Token.decode(`${req.headers.authenticate}`)!;
  const result = await classroom.getWith(data, limit, sort).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).CREATED(result);
};
