exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER", 
		    "fullname": "TEXT", 
		    "username": "TEXT",
		    "mobile": "TEXT",
		    "email": "TEXT",  
		    "position": "TEXT",
		    "role": "TEXT",
		    "created": "TEXT",
		    "updated": "TEXT",
		},
		adapter: {
			type: "sql",
			collection_name: "user",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			 
			getUserById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
						id: res.fieldByName('id'),
					    fullname: res.fieldByName('fullname'),
					    username: res.fieldByName('username'),
					    mobile: res.fieldByName('mobile'),
					    email: res.fieldByName('email') ,
					    position: res.fieldByName('position') ,
					    role: res.fieldByName('role') ,
					    created: res.fieldByName('created') ,
					    updated: res.fieldByName('updated')  
					 
					};
				} 
		 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
           
            saveArray : function(entry){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
 
	            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, fullname, username,email,mobile,position,role,created,updated  ) VALUES (?,?,?,?, ?,?,?,?,?)";
				db.execute(sql_query, entry.id, entry.fullname, entry.username,entry.email,entry.mobile,entry.position, entry.role,entry.created,entry.updated);
				var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET fullname=?, email=?,mobile=?, position=?, role=?,updated=?  WHERE id=?";
				db.execute(sql_query,   entry.fullname,entry.email,entry.mobile,entry.position, entry.role,entry.updated, entry.id);
			 
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		});

		return Collection;
	}
};