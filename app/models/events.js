exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY",
		    "title": "TEXT",
		    "message": "TEXT", 
		    "e_id": "TEXT",
		    "status": "TEXT",
		    "published_by" : "TEXT",
		    "started": "TEXT",
		    "ended": "TEXT", 
		},
  
		adapter: {
			type: "sql",
			collection_name: "events"
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
			getEventByEducation : function(e_id,searchKey){
				var collection = this;
				var search = ""; 
				if(searchKey != ""){
					search = " AND (title LIKE'%"+searchKey +"%' OR message LIKE'%"+searchKey +"%') "; 
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE status !='3'  AND e_id='"+e_id+"' "+search+" ORDER BY started DESC ";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
           		var listArr = []; 
                var count = 0;
                while (res.isValidRow()){ 
					listArr[count] = { 
					    id: res.fieldByName('id'),
					    post_id: res.fieldByName('id'),
						title: res.fieldByName('title'),
						message: res.fieldByName('message'),  
						e_id: res.fieldByName('e_id'),
					    status: res.fieldByName('status'),
					    published_by: res.fieldByName('published_by'),
						started: res.fieldByName('started'),
					    ended: res.fieldByName('ended') 
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			} ,
			getLatestEvent : function(limit){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE status !='3' ORDER BY started DESC LIMIT 0,"+limit;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
           		var listArr = []; 
                var count = 0;
                while (res.isValidRow()){ 
					listArr[count] = { 
					    id: res.fieldByName('id'), 
						title: res.fieldByName('title'),
						message: res.fieldByName('message'),  
						e_id: res.fieldByName('e_id'),
					    status: res.fieldByName('status'),
					    published_by: res.fieldByName('published_by'),
						started: res.fieldByName('started'),
					    ended: res.fieldByName('ended'), 
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			},
			 
			getRecordsById: function(id){ 
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE id ='"+id+"' AND status !='3' ";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
						title: res.fieldByName('title'),
						message: res.fieldByName('message'), 
					    e_id: res.fieldByName('e_id'),
					    status: res.fieldByName('status'),
					    published_by: res.fieldByName('published_by'),
						started: res.fieldByName('started'),
					    ended: res.fieldByName('ended') 
					};
					
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
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, title, message,e_id,status,published_by,started,ended) VALUES (?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.title,  entry.message,entry.e_id ,entry.status,entry.published_by,entry.started,entry.ended);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET title=?,message=?,status=?,published_by=?,started=?,ended=?  WHERE id=?";
					db.execute(sql_query, entry.title,entry.message,entry.status,entry.published_by,entry.started,entry.ended, entry.id);
			 	}); 
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
            resetEvents : function(){
				var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name;
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.execute(sql);
                db.close();
                collection.trigger('sync');
			},
		});

		return Collection;
	}
};
