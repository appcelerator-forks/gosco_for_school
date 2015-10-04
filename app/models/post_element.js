exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER",
		    "post_id" : "INTEGER",
		    "type": "TEXT",
		    "element": "TEXT",  
		    "caption": "TEXT",  
		    "position" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "post_element"
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
			getRecordsById: function(id){ 
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE id ="+id;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
						    post_id: res.fieldByName('post_id'),
						    element: res.fieldByName('element'), 
						    caption: res.fieldByName('caption'), 
						    type: res.fieldByName('type'), 
						    position: res.fieldByName('position') 
					};
					
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getListByPost: function(post_id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" WHERE post_id ='"+post_id+"' ORDER by position ASC";
               
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
						    post_id: res.fieldByName('post_id'),
						    element: res.fieldByName('element'), 
						    caption: res.fieldByName('caption'), 
						    type: res.fieldByName('type'), 
						    position: res.fieldByName('position') 
					};	
					 
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			},
			addElement : function(arr) {
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
	          
	            //db.execute("BEGIN");
				arr.forEach(function(entry) {  
					var ele_arr = entry.element;
					//remove the previous records
					var delete_sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE post_id="+entry.id; 
		           
		           // console.log(delete_sql);
		            db.execute(delete_sql);
					ele_arr.forEach(function(ele) { 
						 
	                	//add new 1 
						var element = ele.element;
						element = element.replace(/["']/g, "&quot;"); 
						
						var caption = ele.caption;
						if(caption != "" &&  caption != null){
							caption = caption.replace(/["']/g, "&quot;"); 
						}
						
			       		sql_query = "INSERT INTO "+ collection.config.adapter.collection_name + "(id, post_id, element,caption, type,position) VALUES ("+ele.id+", '"+ele.p_id+"', '"+element+"', '"+caption+"', '"+ele.type+"' , '"+ele.position+"')";
						 
					    db.execute(sql_query); 
					 });
				});
				 
                //db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
            },
            deletePostElement : function(id){
				var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE post_id="+entry.id; 
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.execute(sql);
                db.close();
                collection.trigger('sync');
			},
            resetPostElement : function(){
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