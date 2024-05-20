
from locust import HttpUser, between, task
class TarsTaskSet(HttpUser):
    
    wait_time = between(1, 5)

    @task
    def get_item(self):
        self.get_item_by_id()

    @task
    def push_item(self):
        self.push_items()
        
    def push_items(self):
        self.client.post("/api/item/create", {"name": "item1", "price": 100, "description": "item1"})
        self.client.post("/api/item/create", {"name": "item2", "price": 200, "description": "item2"})
        self.client.post("/api/item/create", {"name": "item3", "price": 300, "description": "item3"})
    
    @task(3)
    def get_item_by_id(self):
        self.client.get("/api/item/1")
        self.client.get("/api/item/2")
        self.client.get("/api/item/3")
        
    @task(4)
    def get_items(self):
        self.get_all_items()
        
    def get_all_items(self):
        self.client.get("/api/item/getAll")
        
        

    # @task
    # def put_item(self):
    #     self.put_items()
    
    # def put_items(self):
    #     self.client.put("/api/item/1", {"name": "item1", "price": 150, "description": "item1"})
    #     self.client.put("/api/item/2", {"name": "item2", "price": 270, "description": "item2"})
    #     self.client.put("/api/item/3", {"name": "item3", "price": 3, "description": "item3"})
