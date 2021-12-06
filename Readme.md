```shell
npm install body-parser express mysql pug satelize nodemon
```

> mysql install

```bash
# cenots7
sudo yum install mariadb-server mariadb-client -y
sudo systemctl enable mariadb
sudo systemctl start mariadb
mysql_secure_installation

# ssh tunnelling
# ssh -f -L  3306:localhost:3306 instanceOne -N
```

> open port

```shell
# check if the port is open
sudo iptables-save | grep 3306

# add firewall rule
sudo firewall-cmd --zone=public --permanent --add-port=3306/tcp

# restart firewall
sudo firewall-cmd --reload
```

> permissions to mysql user

```mysql

# give permissions 
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '@123Chaitu' WITH GRANT OPTION;
FLUSH PRIVILEGES;
FLUSH HOSTS;


# change password
ALTER USER 'root'@'localhost' IDENTIFIED BY '@123Chaitu';

```

```sql
CREATE database leads_db;
USE leads_db;
CREATE TABLE leads(
    id INT AUTO_INCREMENT NOT NULL  PRIMARY KEY ,
    Name VARCHAR(20)  NOT NULL,
    Email VARCHAR(20) NOT NULL,
    Company VARCHAR(20) NOT NULL,
    Subject VARCHAR(50) NOT NULL,
    Message varchar(100) NOT NULL,
    Ipaddress varchar(15),
    country_code varchar(5),
    userInfo longtext check (JSON_VALID(userInfo)),
    #userInfo JSON,
    Created_at TIMESTAMP DEFAULT NOW() NOT NULL
)
CREATE TABLE views(
                      id INT AUTO_INCREMENT NOT NULL  PRIMARY KEY ,
                      Ipaddress varchar(15),
                      country_code varchar(5),
                      userInfo longtext check (JSON_VALID(userInfo)),
                      #userInfo JSON,
                      Created_at TIMESTAMP DEFAULT NOW() NOT NULL
)
```