drop table if exists payment cascade;
drop table if exists ticket cascade;
drop table if exists vehicle cascade;
drop table if exists routestation cascade;
drop table if exists station cascade;
drop table if exists route cascade;
drop table if exists user_profile cascade;
drop table if exists admin cascade;
drop table if exists operator cascade;
drop table if exists employee cascade;

create table employee (
    employee_id serial primary key,
    salary decimal(10,2),
    hours_worked int,
    station varchar(100)
);

create table operator (
    employee_id int primary key,
    foreign key (employee_id) references employee(employee_id)
);

create table admin (
    employee_id int primary key,
    foreign key (employee_id) references employee(employee_id)
);

create table user_profile (
    user_id serial primary key,
    first_name varchar(50),
    last_name varchar(50),
    email varchar(100) unique,
    telephone varchar(20),
    dob date,
    username varchar(50) unique,
    password varchar(255)
);

create table route (
    route_id serial primary key,
    status varchar(50),
    name varchar(100)
);

create table station (
    station_id serial primary key,
    station_name varchar(100),
    city varchar(100),
    state varchar(100)
);

create table routestation (
    route_id int,
    station_id int,
    stop_sequence int check (stop_sequence > 0),
    primary key (route_id, station_id),
    foreign key (route_id) references route(route_id),
    foreign key (station_id) references station(station_id)
);

create table vehicle (
    vehicle_id serial primary key,
    capacity int check (capacity >= 0),
    occupied_seats int check (occupied_seats >= 0),
    available_seats int check (available_seats >= 0),
    route_id int,
    employee_id int,
    foreign key (route_id) references route(route_id),
    foreign key (employee_id) references employee(employee_id)
);

create table ticket (
    ticket_id serial primary key,
    seat_number varchar(10),
    booking_status varchar(50),
    booking_timestamp timestamp,
    departure_time timestamp,
    arrival_time timestamp,
    trip_timestamp timestamp,
    user_id int,
    vehicle_id int,
    foreign key (user_id) references user_profile(user_id),
    foreign key (vehicle_id) references vehicle(vehicle_id)
);

create table payment (
    payment_id serial primary key,
    method varchar(50),
    amount decimal(10,2) check (amount >= 0),
    transaction_ref varchar(100),
    status varchar(50),
    ticket_id int unique,
    foreign key (ticket_id) references ticket(ticket_id)
);

alter table ticket
add constraint unique_seat_trip
unique (vehicle_id, seat_number, trip_timestamp);

alter table employee
add column first_name varchar(50),
add column last_name varchar(50);

alter sequence employee_employee_id_seq restart with 5263;
alter sequence vehicle_vehicle_id_seq restart with 1101;

insert into employee (salary, hours_worked, station, first_name, last_name)
values
(65000.00, 40, 'new york city', 'Kyla', 'Atkinson'),
(90000.00, 45, 'new jersey', 'Aniya', 'Hopson'),
(65000.00, 40, 'detroit', 'Ricki', 'Davis'),
(65000.00, 40, 'washington dc', 'Nicolas', 'Smith'),
(65000.00, 40, 'nashville', 'Noah', 'Hill');

insert into operator (employee_id)
values
(5263),
(5265),
(5266),
(5267);

insert into admin (employee_id)
values
(5264);

insert into user_profile (first_name, last_name, email, telephone, dob, username, password)
values
('Chris', 'Brown', 'chris.brown@email.com', '7574821936', '1989-05-05', 'cbrown3', 'ChristIsKing444'),
('Nia', 'Long', 'nia.long@email.com', '3106648201', '1970-10-30', 'itsnia', 'Butterfly123'),
('Beyonce', 'Knowles', 'beyonce.knowles@email.com', '2125097741', '1981-09-04', 'bknowles_', 'BeeHive81'),
('Keke', 'Palmer', 'keke.palmer@email.com', '4047283159', '1993-08-26', 'keke.p', 'BigBossKeke'),
('Michael', 'Jordan', 'michael.jordan@email.com', '7736152048', '1987-02-09', 'mjordan_87', 'ILoveDogs111'),
('Teyana', 'Taylor', 'teyana.taylor@email.com', '6463928804', '1990-12-10', 'teyana.t', 'HarlemVibes90'),
('Janelle', 'Monae', 'janelle.monae@email.com', '8164472305', '1985-12-01', 'j.monae', 'ElectricLady7'),
('Meagan', 'Good', 'meagan.good@email.com', '3235801942', '1981-08-08', 'mgood_1', 'PrettyGirl88'),
('Larenz', 'Tate', 'larenz.tate@email.com', '7739014652', '1975-09-08', 'ltate', 'SouthSide75'),
('Regina', 'Hall', 'regina.hall@email.com', '2027443180', '1970-12-12', 'regina.h', 'FunnyLady12'),
('Naturi', 'Naughton', 'naturi.naughton@email.com', '9734186207', '1984-05-20', 'nnaughton', '3LWforever'),
('Omari', 'Hardwick', 'omari.hardwick@email.com', '9015528174', '1974-01-09', 'o_hardwick', 'GhostMode74'),
('Taraji', 'Henson', 'taraji.henson@email.com', '2026831594', '1970-09-11', 'taraji.h', 'CookieLyon1'),
('Gabrielle', 'Union', 'gabrielle.union@email.com', '3054917263', '1972-10-29', 'g.union', 'BringItOn72'),
('Lakeith', 'Stanfield', 'lakeith.stanfield@email.com', '4043175806', '1991-08-12', 'lstanfield', 'Atlanta91'),
('Aja', 'Naomi', 'aja.naomi@email.com', '2146604825', '1984-01-17', 'ajanaomi_', 'HTGAWM84'),
('Ryan', 'Destiny', 'ryan.destiny@email.com', '3134759018', '1995-01-08', 'ryan.d', 'GlowUp95'),
('Lupita', 'Nyongo', 'lupita.nyongo@email.com', '2135972408', '1983-03-01', 'lupita_n', 'OscarGirl83'),
('Daniel', 'Kaluuya', 'daniel.kaluuya@email.com', '9178463512', '1989-02-24', 'dkaluuya', 'LondonBoy89'),
('Coco', 'Jones', 'coco.jones@email.com', '6153387204', '1998-01-04', 'coco.j', 'ICULuvMe98');

insert into route (status, name)
values
('active', 'Atlantic Regional'),
('active', 'Northeast Express'),
('active', 'Capital Corridor'),
('active', 'Great Lakes Line'),
('active', 'Southern Crescent');

insert into station (station_name, city, state)
values
('vab', 'virginia beach', 'virginia'),
('orf', 'norfolk', 'virginia'),
('ric', 'richmond', 'virginia'),
('dc', 'washington dc', 'district of columbia'),
('bal', 'baltimore', 'maryland'),
('phl', 'philadelphia', 'pennsylvania'),
('nyc', 'new york city', 'new york'),
('bos', 'boston', 'massachusetts'),
('det', 'detroit', 'michigan'),
('chi', 'chicago', 'illinois'),
('atl', 'atlanta', 'georgia'),
('nsh', 'nashville', 'tennessee'),
('clt', 'charlotte', 'north carolina'),
('mia', 'miami', 'florida'),
('la', 'los angeles', 'california'),
('sf', 'san francisco', 'california'),
('dal', 'dallas', 'texas'),
('hou', 'houston', 'texas'),
('sea', 'seattle', 'washington'),
('nol', 'new orleans', 'louisiana');

insert into vehicle (capacity, occupied_seats, available_seats, route_id, employee_id)
values
(160, 0, 160, 1, 5263),
(175, 0, 175, 2, 5265),
(150, 0, 150, 3, 5266),
(140, 0, 140, 4, 5267),
(130, 0, 130, 5, 5263);

insert into routestation (route_id, station_id, stop_sequence)
values
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 4, 4),
(1, 5, 5),
(1, 6, 6),
(1, 7, 7),
(1, 8, 8),

(2, 4, 1),
(2, 5, 2),
(2, 6, 3),
(2, 7, 4),
(2, 8, 5),

(3, 3, 1),
(3, 4, 2),
(3, 5, 3),
(3, 6, 4),
(3, 7, 5),

(4, 4, 1),
(4, 6, 2),
(4, 7, 3),
(4, 9, 4),
(4, 10, 5),

(5, 4, 1),
(5, 13, 2),
(5, 11, 3),
(5, 12, 4),
(5, 20, 5);

insert into route (status, name)
values ('active', 'Southwestern Line');

insert into routestation (route_id, station_id, stop_sequence)
values
(6, 20, 1),
(6, 18, 2),
(6, 17, 3),
(6, 15, 4),
(6, 16, 5);

select * from employee;
select * from operator;
select * from admin;
select * from user_profile;
select * from route;
select * from station;
select * from vehicle;

-- aniya

ALTER TABLE employee ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE employee ADD COLUMN IF NOT EXISTS email VARCHAR(100);

UPDATE employee SET password = 'operator123', email = 'kyla.atkinson@tranzit.com' WHERE employee_id = 5263;
UPDATE employee SET password = 'admin123', email = 'aniya.hopson@tranzit.com' WHERE employee_id = 5264;
UPDATE employee SET password = 'operator123', email = 'ricki.davis@tranzit.com' WHERE employee_id = 5265;
UPDATE employee SET password = 'operator123', email = 'nicolas.smith@tranzit.com' WHERE employee_id = 5266;
UPDATE employee SET password = 'operator123', email = 'noah.hill@tranzit.com' WHERE employee_id = 5267;

SELECT employee_id, first_name, last_name, email, password FROM employee;

CREATE TABLE IF NOT EXISTS seat (
    seat_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id),
    UNIQUE (vehicle_id, seat_number)
);

INSERT INTO seat (vehicle_id, seat_number, is_available)
SELECT 
    v.vehicle_id,
    row_label || '-' || col_label AS seat_num,
    TRUE
FROM vehicle v
CROSS JOIN (
    SELECT unnest(ARRAY['A','B','C','D','E','F','G','H','I','J',
                        'K','L','M','N','O','P','Q','R','S','T']) AS row_label
) rows
CROSS JOIN (
    SELECT unnest(ARRAY['L','M','R']) AS col_label
) cols;

ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS employee_id INT;

CREATE TABLE IF NOT EXISTS work_log (
    log_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    clock_in TIMESTAMP,
    clock_out TIMESTAMP,
    total_hours DECIMAL(5,2),
    log_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

-- scheduling

CREATE TABLE IF NOT EXISTS schedule (
    schedule_id SERIAL PRIMARY KEY,
    route_id INT NOT NULL,
    station_id INT NOT NULL,
    stop_sequence INT,
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES route(route_id),
    FOREIGN KEY (station_id) REFERENCES station(station_id)
);
insert into schedule (route_id, station_id, stop_sequence, arrival_time, departure_time)
values
(1, 1, 1, '2026-05-01 08:00:00', '2026-05-01 08:05:00'),
(1, 2, 2, '2026-05-01 08:30:00', '2026-05-01 08:35:00'),
(1, 3, 3, '2026-05-01 09:00:00', '2026-05-01 09:05:00'),
(1, 4, 4, '2026-05-01 09:30:00', '2026-05-01 09:35:00'),
(1, 5, 5, '2026-05-01 10:00:00', '2026-05-01 10:05:00'),
(1, 6, 6, '2026-05-01 10:30:00', '2026-05-01 10:35:00'),
(1, 7, 7, '2026-05-01 11:00:00', '2026-05-01 11:05:00'),
(1, 8, 8, '2026-05-01 11:30:00', '2026-05-01 11:35:00'),

(2, 4, 1, '2026-05-01 08:00:00', '2026-05-01 08:05:00'),
(2, 5, 2, '2026-05-01 08:30:00', '2026-05-01 08:35:00'),
(2, 6, 3, '2026-05-01 09:00:00', '2026-05-01 09:05:00'),
(2, 7, 4, '2026-05-01 09:30:00', '2026-05-01 09:35:00'),
(2, 8, 5, '2026-05-01 10:00:00', '2026-05-01 10:05:00'),

(3, 3, 1, '2026-05-01 08:00:00', '2026-05-01 08:05:00'),
(3, 4, 2, '2026-05-01 08:30:00', '2026-05-01 08:35:00'),
(3, 5, 3, '2026-05-01 09:00:00', '2026-05-01 09:05:00'),
(3, 6, 4, '2026-05-01 09:30:00', '2026-05-01 09:35:00'),
(3, 7, 5, '2026-05-01 10:00:00', '2026-05-01 10:05:00'),

(4, 4, 1, '2026-05-01 08:00:00', '2026-05-01 08:05:00'),
(4, 6, 2, '2026-05-01 08:30:00', '2026-05-01 08:35:00'),
(4, 7, 3, '2026-05-01 09:00:00', '2026-05-01 09:05:00'),
(4, 9, 4, '2026-05-01 09:30:00', '2026-05-01 09:35:00'),
(4, 10, 5, '2026-05-01 10:00:00', '2026-05-01 10:05:00'),

(5, 4, 1, '2026-05-01 08:00:00', '2026-05-01 08:05:00'),
(5, 13, 2, '2026-05-01 08:30:00', '2026-05-01 08:35:00'),
(5, 11, 3, '2026-05-01 09:00:00', '2026-05-01 09:05:00'),
(5, 12, 4, '2026-05-01 09:30:00', '2026-05-01 09:35:00'),
(5, 20, 5, '2026-05-01 10:00:00', '2026-05-01 10:05:00'),

(6, 20, 1, '2026-05-01 08:00:00', '2026-05-01 08:05:00'),
(6, 18, 2, '2026-05-01 08:30:00', '2026-05-01 08:35:00'),
(6, 17, 3, '2026-05-01 09:00:00', '2026-05-01 09:05:00'),
(6, 15, 4, '2026-05-01 09:30:00', '2026-05-01 09:35:00'),
(6, 16, 5, '2026-05-01 10:00:00', '2026-05-01 10:05:00');