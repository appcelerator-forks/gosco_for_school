exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY", 
		    "e_id": "TEXT", 
		    "year": "TEXT",
		    "className": "TEXT", 
		    'status': "INTEGER",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},
	  
		adapter: {
			type: "sql",
			collection_name: "education_class",
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
			getEducationClassById : function(id){
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
					    e_id: res.fieldByName('e_id'),
					    year: res.fieldByName('year'),
					    className: res.fieldByName('className'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'), 
					    updated: res.fieldByName('updated') 
					};
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
		 
            getEducationClassList :  function(year, e_id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE e_id='"+ e_id+ "' AND year='"+year+"' ORDER BY className " ;
 				 
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
						id: res.fieldByName('id'), 
					    e_id: res.fieldByName('e_id'),
					    year: res.fieldByName('year'),
					    className: res.fieldByName('className'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'), 
					    updated: res.fieldByName('updated') 
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
            saveArray : function(arr){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
        		arr.forEach(function(entry) {
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, e_id, year,className,status,created,updated) VALUES (?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.e_id,  entry.year,entry.class ,entry.status,entry.created,entry.updated);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET e_id=?,year=?,className=?,status=?,updated=? WHERE id=?";
					db.execute(sql_query, entry.e_id,entry.year,entry.class,  entry.status ,entry.updated, entry.id);
			 		 
			 	});
			 
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		}); 
		return Collection;
	}
};