module.exports = class {
	constructor(mongoClient, url) {
		this.url = url;
    this.db = null;
    this.mongoClient = mongoClient;
	}

	async connect(dbName) {
    this.db = (await this.mongoClient.connect(this.url, {
      useNewUrlParser: true,
			useUnifiedTopology: true
    })).db(dbName);
		console.log("Database connected");
  }
  
  async insert(companies, table){
    await this.db.collection(table).insertMany(companies)
  }

  async find(table, query){
    console.log(table)
    return await this.db.collection(table).find(query).toArray()
  }

  async update(name, labels, table){
    await this.db.collection(table).updateOne({company_name: name}, {$set: {Predicted_labels: labels}})
  }
};