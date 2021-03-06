exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER",
		    "title": "TEXT",
		    "message": "TEXT", 
		    "c_id": "TEXT",
		    "status": "TEXT",
		    "published_by": "TEXT",
		    "publish_date": "TEXT",
		    "expired_date": "TEXT",
		    "images": "TEXT"
		},
  
		adapter: {
			type: "sql",
			collection_name: "curriculumPost"
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
			getLatestPostByCurriculum : function(c_id,searchKey){
				var collection = this;
				var search = "";  
				if(searchKey != ""){
					search = " AND (title LIKE'%"+searchKey +"%' OR message LIKE'%"+searchKey +"%' ) "; 
				}
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE status !='3' AND c_id='"+c_id+"' " +search +" ORDER BY publish_date DESC LIMIT 0,10";
              
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
						c_id: res.fieldByName('c_id'),
					    status: res.fieldByName('status'),
					    published_by: res.fieldByName('published_by'),
						publish_date: res.fieldByName('publish_date'),
					    expired_date: res.fieldByName('expired_date'),
					    images: res.fieldByName('images'),
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			} ,
			getLatestPost : function(c_id, limit){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE status !='3' AND c_id='"+c_id+"' ORDER BY publish_date DESC LIMIT 0,"+limit;
                
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
						c_id: res.fieldByName('c_id'),
					    status: res.fieldByName('status'),
					    published_by: res.fieldByName('published_by'),
						publish_date: res.fieldByName('publish_date'),
					    expired_date: res.fieldByName('expired_date'),
					    images: res.fieldByName('images'),
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
					    c_id: res.fieldByName('c_id'),
					    status: res.fieldByName('status'),
					    published_by: res.fieldByName('published_by'),
						publish_date: res.fieldByName('publish_date'),
					    expired_date: res.fieldByName('expired_date'),
					    images: res.fieldByName('images'),
					};
					
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			searchItems : function(keyword){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE title LIKE'%"+keyword+"%' OR description LIKE'%"+keyword+"%' OR tags LIKE'%"+keyword+"%' AND status= '1' ORDER BY publish_date DESC ";
               // console.log(sql);
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
						c_id: res.fieldByName('c_id'),
						description: res.fieldByName('description'),  
					    status: res.fieldByName('status'),
					    published_by: res.fieldByName('published_by'),
						publish_date: res.fieldByName('publish_date'),
					    expired_date: res.fieldByName('expired_date'),
					    images: res.fieldByName('images'),
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			},
			
			addPost : function(arr) { 
	            var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
	            if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                
					
	           // db.execute("BEGIN");
				arr.forEach(function(entry) {
					//remove the previous records
					var delete_sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE id="+entry.id;  
	                db.execute(delete_sql);
                
                	//add new 1
					var title = entry.title;
					title = title.replace(/["']/g, "&quot;"); 
					var message = entry.message;
					if(message!=""){
						message = message.replace(/["']/g, "&quot;"); 
					}
					
		       		sql_query = "INSERT INTO "+ collection.config.adapter.collection_name + "(id, title, message,c_id, status,published_by,publish_date, expired_date, images) VALUES ('"+entry.id+"', '"+title+"', '"+message+"', '"+entry.c_id+"' , '"+entry.status+"', '"+entry.published_by+"', '"+entry.publish_date+"', '"+entry.expired_date+"', '"+entry.images+"')";
			 
					db.execute(sql_query);
				});
               // db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
	            
            },
            resetPost : function(){
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
