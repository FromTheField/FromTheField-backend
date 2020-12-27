import Keystore,{KeystoreModel} from "../models/keystore";
import User from "../models/User";
import {Types} from 'mongoose'


export default class KeystoreRepo {
    public static findforKey(client: User, key: string): Promise<Keystore> {
      return KeystoreModel.findOne({ client: client, primaryKey: key, status: true }).exec();
    }
  
    public static remove(id: Types.ObjectId): Promise<Keystore> {
      return KeystoreModel.findByIdAndRemove(id).lean<Keystore>().exec();
    }
  
    public static find(client: User, primaryKey: string, secondaryKey: string): Promise<Keystore> {
      return KeystoreModel.findOne({
        client: client,
        primaryKey: primaryKey,
        secondaryKey: secondaryKey,
      })
        .lean<Keystore>()
        .exec();
    }
  
    public static findById(id:string): Promise<Keystore> {
      return KeystoreModel.findById(id)
        .lean<Keystore>()
        .exec();
    }
    public static async create(
      client: User,
      primaryKey: string,
      secondaryKey: string,
    ): Promise<Keystore> {
      const now = new Date();
      let keystore:Keystore;
      KeystoreModel.findOneAndUpdate({client}, {$set:{primaryKey,secondaryKey}}, {new: true}, async (err, doc) => {
        if (err) {
          keystore = await KeystoreModel.create(({
            client: client,
            primaryKey: primaryKey,
            secondaryKey: secondaryKey,
            createdAt: now,
            updatedAt: now,
          } as unknown )as Keystore);
        }
    
        console.log(doc,err);
    });
     
      return keystore.toObject();
    }
  }