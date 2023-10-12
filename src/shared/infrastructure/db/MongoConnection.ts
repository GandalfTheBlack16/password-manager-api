import mongoose, { type Connection } from 'mongoose'

export class MongoConnection {
  private readonly URL = process.env.MONGO_URI ?? 'mongodb://localhost:27017'
  private readonly DATABASE = process.env.MONGO_DATABASE ?? 'password-manager'
  private readonly USER = process.env.MONGO_USER ?? 'root'
  private readonly PASSWORD = process.env.MONGO_PWD ?? ''
  private instance: Connection | null

  constructor () {
    this.instance = null
  }

  async connect (): Promise<void> {
    const mongo = await mongoose.connect(this.URL, {
      dbName: this.DATABASE,
      auth: {
        username: this.USER,
        password: this.PASSWORD
      }
    })
    this.instance = mongo.connection
  }

  async disconnect (): Promise<void> {
    await this.instance?.close()
    this.instance = null
  }

  getDataBaseInfo (): string {
    if (this.instance) {
      const { host, port, name } = this.instance
      return `mongodb://${this.USER}:****@${host}:${port}/${name}`
    }
    return ''
  }

  databaseUp (): boolean {
    return !!this.instance
  }
}
