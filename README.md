### **Description:**

Script visualizes spatial temporal clusters from data set consisting of wkt- points and lines with uncertain parameters 

### **Usage:**

1. `npm install`
1. Generate output file `data.csv` using [Spatial Temporal Tuples Generator](https://github.com/vadimkorr/Spatial-Temporal-Tuples-Generator.git) and put it in `server/`
1. Add relative path of the dataset file to file-names-list.txt
1. Run file server from `server/` by running `start_server.bat` or by launching command `node server.js [port]`, e.g. `node server.js 8081` (port 8080 by default)
1. Open `index.html` in browser

### **Example:**

![Cluster Visualizer](https://content.screencast.com/users/mintday/folders/git%20images/media/ffe4a7a5-60f1-473c-9244-17f6d1808a18/cluster.jpg)