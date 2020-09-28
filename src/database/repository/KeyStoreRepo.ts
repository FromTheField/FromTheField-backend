import Keystore, { KeyStoreModel } from "../models/keystore";
import User from "../models/mentee";

export default class KeystoreRepo {
  public static async create(
    client: User,
    primaryKey: string,
    secondaryKey: string
  ): Promise<Keystore> {
    const now = new Date();
    const keystore = await KeyStoreModel.create(({
      client,
      primaryKey,
      secondaryKey,
      createdAt: now,
      updatedAt: now,
    } as unknown) as Keystore);
    return keystore.toObject();
  }
}
