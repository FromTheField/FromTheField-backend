import Keystore, { KeyStoreModel } from "../models/keystore";
import Mentee from "../models/mentee";
import Mentor from "../models/mentor";

export default class KeystoreRepo {
  public static async create(
    primaryKey: string,
    secondaryKey: string,
    mentee?: Mentee,
    mentor?: Mentor
  ): Promise<Keystore> {
    const now = new Date();
    const keystore = await KeyStoreModel.create(({
      mentee,
      mentor,
      primaryKey,
      secondaryKey,
      createdAt: now,
      updatedAt: now,
    } as unknown) as Keystore);
    return keystore.toObject();
  }
}
