-- 1.USERS
CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    country text NOT NULL,
    role text NOT NULL,
    is_deleted boolean NOT NULL,
    creation_date timestamp NOT NULL,
    last_updated timestamp,         
    modified_by text,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- 2.DATES 
CREATE TABLE IF NOT EXISTS public.dates
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    year bigint NOT NULL,
    month bigint,
    day bigint,
    CONSTRAINT dates_pkey PRIMARY KEY (id)
);

-- 3. PLAYLISTS
CREATE TABLE IF NOT EXISTS public.playlists
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    type text NOT NULL,
    creation_date timestamp NOT NULL,
    last_updated timestamp,       
    user_id bigint NOT NULL,
    modified_by text,
    CONSTRAINT playlists_pkey PRIMARY KEY (id),
    CONSTRAINT playlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
);

-- 4. ARTISTS 
CREATE TABLE IF NOT EXISTS public.artists
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    type text NOT NULL, 
    start_date_id bigint NOT NULL,
    end_date_id bigint,
    CONSTRAINT artists_pkey PRIMARY KEY (id),
    CONSTRAINT artists_end_date_id_fkey FOREIGN KEY (end_date_id) REFERENCES public.dates (id),
    CONSTRAINT artists_start_date_id_fkey FOREIGN KEY (start_date_id) REFERENCES public.dates (id)
);

--5. ALBUMS
CREATE TABLE IF NOT EXISTS public.albums
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    description text NOT NULL,
    genre text NOT NULL,
    release_date date NOT NULL, 
    label text NOT NULL,
    artist_id bigint NOT NULL,
    creation_date timestamp NOT NULL,
    last_updated timestamp,       
    modified_by text,
    CONSTRAINT albums_pkey PRIMARY KEY (id),
    CONSTRAINT albums_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists (id)
);

--6. USER_PLAYLIST 
CREATE TABLE IF NOT EXISTS public.user_playlist
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id bigint NOT NULL,
	playlist_id bigint NOT NULL,
    CONSTRAINT user_playlist_pkey PRIMARY KEY (id),
    CONSTRAINT user_playlist_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists (id),
    CONSTRAINT user_playlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
);

--7. BANDS
CREATE TABLE IF NOT EXISTS public.bands
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    band_name text NOT NULL,
    location text NOT NULL,
    creation_date timestamp NOT NULL, 
    last_updated timestamp,      
    modified_by text,
    artist_id bigint NOT NULL,
    CONSTRAINT bands_pkey PRIMARY KEY (id),
    CONSTRAINT bands_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists (id)
);

--8. PERSONS
CREATE TABLE IF NOT EXISTS public.persons
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    stage text NOT NULL,
    birthday date NOT NULL,
    artist_id bigint NOT NULL,
    band_id bigint,
    creation_date timestamp NOT NULL,
    last_updated timestamp,        
    modified_by text,
    CONSTRAINT persons_pkey PRIMARY KEY (id),
    CONSTRAINT persons_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists (id),
    CONSTRAINT persons_band_id_fkey FOREIGN KEY (band_id) REFERENCES public.bands (id)
);

--9. SONGS
CREATE TABLE IF NOT EXISTS public.songs
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    duration text NOT NULL,
    creation_date timestamp NOT NULL,
    last_updated timestamp,         
    modified_by text,
    album_id bigint,
    CONSTRAINT songs_pkey PRIMARY KEY (id),
    CONSTRAINT songs_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums (id)
);

--10. PLAYLIST_SONG
CREATE TABLE IF NOT EXISTS public.playlist_song
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    playlist_id bigint NOT NULL,
    song_id bigint NOT NULL,
    song_order bigint NOT NULL,
    CONSTRAINT playlist_song_pkey PRIMARY KEY (id),
	CONSTRAINT unique_order_in_playlist UNIQUE (playlist_id, song_order), 
    CONSTRAINT playlist_song_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists (id) ON DELETE CASCADE,
    CONSTRAINT playlist_song_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs (id) ON DELETE CASCADE
);

--11. ALTERNATIVE-TITLES 
CREATE TABLE IF NOT EXISTS public.alternative_titles
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    language text NOT NULL,
    song_id bigint NOT NULL,
    CONSTRAINT alternative_titles_pkey PRIMARY KEY (id),
    CONSTRAINT alternative_titles_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs (id)
);

--12. SONG_ARTIST 
CREATE TABLE IF NOT EXISTS public.song_artist
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    artist_id bigint NOT NULL,
	song_id bigint NOT NULL,
    CONSTRAINT song_artist_pkey PRIMARY KEY (id),
    CONSTRAINT song_artist_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists (id),
    CONSTRAINT song_artist_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs (id)
);

----------------------------------------------------
-- DATA INSERTION (Fixed ID issues)
----------------------------------------------------

-- dates (20 records)
INSERT INTO public.dates (year, month, day) VALUES
 (2025, 5, 3), (2025, NULL, NULL), (2024, 1, 1), (2016, 8, 23), (2014, NULL, NULL),
 (2014, 11, 30), (2013, 4, 2), (2020, 9, 5), (2017, 7, 15), (2021, 10, 9),
 (2019, 3, 20), (2022, 12, 25), (2018, 6, 30), (2015, 2, 14), (2023, 8, 1),
 (2012, 11, 11), (2011, 9, 19), (2010, 10, 10), (2009, 7, 7), (2008, 6, 6),
 (2018, 3, 15), (2019, 6, null), (2020, 9, 22), (2017, 11, 8), (2016, 4, null),
 (2015, 8, 30), (2021, 12, 14), (2022, 2, null), (2023, 5, 19), (2024, 7, 7);

-- users (10 records)
INSERT INTO public.users (first_name, last_name, email, password, country, role, is_deleted, creation_date, last_updated, modified_by) VALUES
 ('John','Smith','john.smith@example.com','password123','USA','ADMIN', FALSE,'2025-01-01 10:00:00','2025-01-01 10:00:00', NULL),
 ('Jane','Johnson','jane.johnson@example.com','password123','Canada','ADMIN', FALSE,'2025-01-02 10:00:00','2025-01-02 10:00:00', 'john.smith@example.com'),
 ('Alice','Williams','alice.williams@example.com','password123','UK','REGULAR', FALSE,'2025-01-03 10:00:00','2025-01-03 10:00:00', 'jane.johnson@example.com'),
 ('Bob','Brown','bob.brown@example.com','password123','Germany','REGULAR', FALSE,'2025-01-04 10:00:00','2025-01-04 10:00:00', 'alice.williams@example.com'),
 ('Carol','Jones','carol.jones@example.com','password123','Australia','REGULAR', FALSE,'2025-01-05 10:00:00','2025-01-05 10:00:00', 'bob.brown@example.com'),
 ('Dave','Miller','dave.miller@example.com','password123','Brazil','REGULAR', FALSE,'2025-01-06 10:00:00','2025-01-06 10:00:00', 'carol.jones@example.com'),
 ('Eve','Davis','eve.davis@example.com','password123','France','REGULAR', FALSE,'2025-01-07 10:00:00','2025-01-07 10:00:00', 'dave.miller@example.com'),
 ('Frank','Garcia','frank.garcia@example.com','password123','Spain','REGULAR', FALSE,'2025-01-08 10:00:00','2025-01-08 10:00:00', 'eve.davis@example.com'),
 ('Grace','Rodriguez','grace.rodriguez@example.com','password123','Italy','REGULAR', TRUE,'2025-01-09 10:00:00','2025-01-09 10:00:00', 'frank.garcia@example.com'),
 ('Heidi','Wilson','heidi.wilson@example.com','password123','Japan','REGULAR', TRUE,'2025-01-10 10:00:00','2025-01-10 10:00:00', 'grace.rodriguez@example.com');

-- artists (20 records)
INSERT INTO public.artists (type, start_date_id, end_date_id) VALUES
 ('PERSON', 1, NULL), ('BAND', 2, NULL), ('BAND', 3, NULL), ('PERSON', 4, NULL), ('BAND', 5, NULL),
 ('BAND', 6, NULL), ('PERSON', 7, NULL), ('BAND', 8, NULL), ('BAND', 9, NULL), ('PERSON', 10, NULL),
 ('PERSON', 11, NULL), ('BAND', 12, NULL), ('PERSON', 13, NULL), ('BAND', 14, NULL), ('PERSON', 15, NULL),
 ('BAND', 16, NULL), ('PERSON', 17, NULL), ('BAND', 18, NULL), ('PERSON', 19, NULL), ('BAND', 20, NULL),
 ('BAND', 21, NULL), ('BAND', 22, NULL), ('PERSON', 23, NULL), ('BAND', 24, NULL), ('BAND', 25, NULL),
 ('PERSON', 26, NULL), ('BAND', 27, NULL), ('BAND', 28, NULL), ('PERSON', 29, NULL), ('BAND', 30, NULL);


-- playlists (20 records)
INSERT INTO public.playlists (name, type, creation_date, last_updated, user_id, modified_by) VALUES
 ('Chill Vibes', 'PUBLIC', '2025-01-01 11:00:00','2025-01-01 11:00:00', 1, 'jane.johnson@example.com'),
 ('Workout Mix', 'PRIVATE','2025-01-02 11:00:00','2025-01-02 11:00:00', 2, 'alice.williams@example.com'),
 ('Road Trip', 'PUBLIC', '2025-01-03 11:00:00','2025-01-03 11:00:00', 3, 'bob.brown@example.com'),
 ('Study Beats', 'PRIVATE','2025-01-04 11:00:00','2025-01-04 11:00:00', 4, 'carol.jones@example.com'),
 ('Dinner Jazz', 'PUBLIC', '2025-01-05 11:00:00','2025-01-05 11:00:00', 5, 'dave.miller@example.com'),
 ('Throwbacks', 'PRIVATE','2025-01-06 11:00:00','2025-01-06 11:00:00', 6, NULL),
 ('Top Hits', 'PUBLIC', '2025-01-07 11:00:00','2025-01-07 11:00:00', 7, NULL),
 ('Indie Gems', 'PRIVATE','2025-01-08 11:00:00','2025-01-08 11:00:00', 8, NULL),
 ('Party Starters', 'PUBLIC', '2025-01-09 11:00:00','2025-01-09 11:00:00', 9, NULL),
 ('Relaxation', 'PRIVATE','2025-01-10 11:00:00','2025-01-10 11:00:00',10, NULL),
 ('Summer Jams', 'PUBLIC', '2025-01-11 11:00:00','2025-01-11 11:00:00', 1, 'eve.davis@example.com'),
 ('Night Drive', 'PRIVATE','2025-01-12 11:00:00','2025-01-12 11:00:00', 2, 'frank.garcia@example.com'),
 ('Festival Hits', 'PUBLIC', '2025-01-13 11:00:00','2025-01-13 11:00:00', 3, 'grace.rodriguez@example.com'),
 ('Focus Flow', 'PRIVATE','2025-01-14 11:00:00','2025-01-14 11:00:00', 4, 'heidi.wilson@example.com'),
 ('Acoustic Evenings', 'PUBLIC', '2025-01-15 11:00:00','2025-01-15 11:00:00', 5, 'john.smith@example.com'),
 ('Retro Hits', 'PRIVATE','2025-01-16 11:00:00','2025-01-16 11:00:00', 6, NULL),
 ('Pop Anthems', 'PUBLIC', '2025-01-17 11:00:00','2025-01-17 11:00:00', 7, NULL),
 ('Chillout Lounge', 'PRIVATE','2025-01-18 11:00:00','2025-01-18 11:00:00', 8, NULL),
 ('Dance Party', 'PUBLIC', '2025-01-19 11:00:00','2025-01-19 11:00:00', 9, NULL),
 ('Mellow Tunes', 'PRIVATE','2025-01-20 11:00:00','2025-01-20 11:00:00',10, NULL);

-- albums (20 records)
INSERT INTO public.albums (title, description, genre, release_date, label, artist_id, creation_date, last_updated, modified_by) VALUES
 ('Album One', 'Debut release', 'rock', '2025-01-01','LabelA', 1,'2025-01-01 12:00:00','2025-01-01 12:00:00', 'bob.brown@example.com'),
 ('Album Two', 'Sophomore album', 'pop', '2025-01-02','LabelB', 2,'2025-01-02 12:00:00','2025-01-02 12:00:00', 'carol.jones@example.com'),
 ('Album Three', 'Live recording', 'jazz', '2025-01-03','LabelC', 3,'2025-01-03 12:00:00','2025-01-03 12:00:00', 'dave.miller@example.com'),
 ('Album Four', 'Greatest hits', 'classical', '2025-01-04','LabelD', 4,'2025-01-04 12:00:00','2025-01-04 12:00:00', 'eve.davis@example.com'),
 ('Album Five', 'Acoustic sessions', 'hiphop', '2025-01-05','LabelE', 5,'2025-01-05 12:00:00','2025-01-05 12:00:00', 'frank.garcia@example.com'),
 ('Album Six', 'Remixes', 'electronic','2025-01-06','LabelA', 6,'2025-01-06 12:00:00','2025-01-06 12:00:00', 'grace.rodriguez@example.com'),
 ('Album Seven', 'Tribute', 'folk', '2025-01-07','LabelB', 7,'2025-01-07 12:00:00','2025-01-07 12:00:00', 'heidi.wilson@example.com'),
 ('Album Eight', 'Compilation', 'blues', '2025-01-08','LabelC', 8,'2025-01-08 12:00:00','2025-01-08 12:00:00', NULL),
 ('Album Nine', 'EP', 'reggae', '2025-01-09','LabelD', 9,'2025-01-09 12:00:00','2025-01-09 12:00:00', NULL),
 ('Album Ten', 'Special edition', 'country', '2025-01-10','LabelE', 10,'2025-01-10 12:00:00','2025-01-10 12:00:00', NULL),
 ('Album Eleven', 'New vibes', 'indie', '2025-01-11','LabelF', 11,'2025-01-11 12:00:00','2025-01-11 12:00:00', 'john.smith@example.com'),
 ('Album Twelve', 'Remastered hits', 'rock', '2025-01-12','LabelG', 12,'2025-01-12 12:00:00','2025-01-12 12:00:00', 'jane.johnson@example.com'),
 ('Album Thirteen', 'Studio sessions', 'pop', '2025-01-13','LabelH', 13,'2025-01-13 12:00:00','2025-01-13 12:00:00', 'alice.williams@example.com'),
 ('Album Fourteen', 'Live unplugged', 'jazz', '2025-01-14','LabelI', 14,'2025-01-14 12:00:00','2025-01-14 12:00:00', 'bob.brown@example.com'),
 ('Album Fifteen', 'Greatest covers', 'classical', '2025-01-15','LabelJ', 15,'2025-01-15 12:00:00','2025-01-15 12:00:00', 'carol.jones@example.com'),
 ('Album Sixteen', 'Chill beats', 'hiphop', '2025-01-16','LabelA', 16,'2025-01-16 12:00:00','2025-01-16 12:00:00', 'dave.miller@example.com'),
 ('Album Seventeen', 'Electronic vibes', 'electronic', '2025-01-17','LabelB', 17,'2025-01-17 12:00:00','2025-01-17 12:00:00', 'eve.davis@example.com'),
 ('Album Eighteen', 'Folk tales', 'folk', '2025-01-18','LabelC', 18,'2025-01-18 12:00:00','2025-01-18 12:00:00', NULL),
 ('Album Nineteen', 'Blues nights', 'blues', '2025-01-19','LabelD', 19,'2025-01-19 12:00:00','2025-01-19 12:00:00', NULL),
 ('Album Twenty', 'Reggae rhythms', 'reggae', '2025-01-20','LabelE', 20,'2025-01-20 12:00:00','2025-01-20 12:00:00', NULL),
 ('Bonus Tracks', 'Collection of rare tracks', 'various', '2025-02-01', 'LabelX', 21, '2025-02-01 12:00:00', '2025-02-01 12:00:00', 'john.smith@example.com'),
 ('Live Sessions', 'Recorded at concert hall', 'rock', '2025-02-02', 'LabelY', 22, '2025-02-02 12:00:00', '2025-02-02 12:00:00', 'jane.johnson@example.com'),
 ('Acoustic Covers', 'Stripped-down versions', 'folk', '2025-02-03', 'LabelZ', 23, '2025-02-03 12:00:00', '2025-02-03 12:00:00', 'alice.williams@example.com'),
 ('Remix Collection', 'Dance floor ready mixes', 'electronic', '2025-02-04', 'LabelW', 24, '2025-02-04 12:00:00', '2025-02-04 12:00:00', 'bob.brown@example.com'),
 ('Greatest Hits Vol. 2', 'More fan favorites', 'pop', '2025-02-05', 'LabelV', 25, '2025-02-05 12:00:00', '2025-02-05 12:00:00', 'carol.jones@example.com'),
 ('Midnight Sessions', 'Late night recording sessions', 'jazz', '2025-03-01', 'Midnight Records', 1, '2025-03-01 12:00:00', '2025-03-01 12:00:00', 'john.smith@example.com'),
 ('Electric Dreams', 'Synth-heavy experimental album', 'electronic', '2025-03-02', 'Voltage Music', 2, '2025-03-02 12:00:00', '2025-03-02 12:00:00', 'jane.johnson@example.com'),
 ('Unplugged', 'Intimate acoustic performances', 'folk', '2025-03-03', 'Wooden Records', 3, '2025-03-03 12:00:00', '2025-03-03 12:00:00', 'alice.williams@example.com'),
 ('Neon Nights', '80s inspired synthwave', 'electronic', '2025-03-04', 'Retro Future', 4, '2025-03-04 12:00:00', '2025-03-04 12:00:00', 'bob.brown@example.com'),
 ('The B-Sides', 'Rare and unreleased tracks', 'rock', '2025-03-05', 'Archive Sounds', 5, '2025-03-05 12:00:00', '2025-03-05 12:00:00', 'carol.jones@example.com'),
 ('Live at the Arena', 'Recorded during world tour', 'pop', '2025-03-06', 'Tour Records', 6, '2025-03-06 12:00:00', '2025-03-06 12:00:00', 'dave.miller@example.com'),
 ('Instrumentals', 'Music without vocals', 'classical', '2025-03-07', 'Pure Sounds', 7, '2025-03-07 12:00:00', '2025-03-07 12:00:00', 'eve.davis@example.com'),
 ('Collaborations', 'Featuring special guests', 'hiphop', '2025-03-08', 'Teamwork Music', 8, '2025-03-08 12:00:00', '2025-03-08 12:00:00', 'frank.garcia@example.com'),
 ('The Early Years', 'First recordings from the vault', 'blues', '2025-03-09', 'History Records', 9, '2025-03-09 12:00:00', '2025-03-09 12:00:00', 'grace.rodriguez@example.com'),
 ('Remastered Classics', 'Digitally enhanced versions', 'rock', '2025-03-10', 'Legacy Sounds', 10, '2025-03-10 12:00:00', '2025-03-10 12:00:00', 'heidi.wilson@example.com'),
 ('Album One B-Sides', 'Rare tracks from debut sessions', 'rock', '2025-02-01','LabelA', 1,'2025-02-01 12:00:00','2025-02-01 12:00:00', 'bob.brown@example.com'),
 ('The Beats Live', 'Concert recordings', 'rock', '2025-03-01','LabelA', 2,'2025-03-01 12:00:00','2025-03-01 12:00:00', 'carol.jones@example.com'),
 ('Album Three Deluxe', 'Expanded edition', 'jazz', '2025-02-15','LabelC', 3,'2025-02-15 12:00:00','2025-02-15 12:00:00', 'dave.miller@example.com'),
 ('Solo Sessions', 'Intimate recordings', 'classical', '2025-03-10','LabelD', 4,'2025-03-10 12:00:00','2025-03-10 12:00:00', 'eve.davis@example.com'),
 ('Electric Dreams', 'Experimental sounds', 'electronic', '2025-02-20','LabelE', 5,'2025-02-20 12:00:00','2025-02-20 12:00:00', 'frank.garcia@example.com');

-- user_playlist (20 records)
INSERT INTO public.user_playlist (playlist_id, user_id) VALUES
 (1,10),(2,9),(3,8),(4,7),(5,6),(6,5),(7,4),(8,3),(9,2),(10,1),
 (11,2),(12,3),(13,4),(14,5),(15,6),(16,7),(17,8),(18,9),(19,10),(20,1),
 (1, 2), (1, 3), (2, 4), (2, 5), (3, 6),
 (4, 7), (5, 8), (6, 9), (7, 10), (8, 1); 

-- bands (11 records)
INSERT INTO public.bands (band_name, location, creation_date, last_updated, modified_by, artist_id) VALUES
 ('The Beats', 'NY', '2025-01-01 13:00:00','2025-01-01 13:00:00', 'carol.jones@example.com', 2),
 ('The Rockets', 'LA', '2025-01-02 13:00:00','2025-01-02 13:00:00', 'dave.miller@example.com', 3),
 ('Sunset DJs', 'London', '2025-01-03 13:00:00','2025-01-03 13:00:00', 'eve.davis@example.com', 5),
 ('Ocean Waves', 'Berlin', '2025-01-04 13:00:00','2025-01-04 13:00:00', 'frank.garcia@example.com', 6),
 ('Mountain Folk', 'Tokyo', '2025-01-05 13:00:00','2025-01-05 13:00:00', 'grace.rodriguez@example.com', 8),
 ('City Lights', 'Rio', '2025-01-06 13:00:00','2025-01-06 13:00:00', 'heidi.wilson@example.com', 9),
 ('Desert Tunes', 'Paris', '2025-01-07 13:00:00','2025-01-07 13:00:00', 'john.smith@example.com', 12),
 ('Rainforest', 'Madrid', '2025-01-08 13:00:00','2025-01-08 13:00:00', NULL, 14),
 ('Snowfall', 'Rome', '2025-01-09 13:00:00','2025-01-09 13:00:00', NULL, 16),
 ('Twilight', 'Sydney', '2025-01-10 13:00:00','2025-01-10 13:00:00', NULL, 18),
 ('Starlight', 'Miami', '2025-01-11 13:00:00','2025-01-11 13:00:00', 'alice.williams@example.com', 20),
 ('Midnight Echo', 'Chicago', '2018-03-15 13:00:00', '2018-03-15 13:00:00', 'john.smith@example.com', 21),
 ('Electric Dreams', 'Seattle', '2019-06-01 13:00:00', '2019-06-01 13:00:00', 'jane.johnson@example.com', 22),
 ('Neon Lights', 'Austin', '2020-09-22 13:00:00', '2020-09-22 13:00:00', 'alice.williams@example.com', 24),
 ('The Harmonics', 'Nashville', '2017-11-08 13:00:00', '2017-11-08 13:00:00', 'bob.brown@example.com', 25),
 ('Cosmic Waves', 'Portland', '2016-04-01 13:00:00', '2016-04-01 13:00:00', 'carol.jones@example.com', 27),
 ('Urban Legends', 'Detroit', '2015-08-30 13:00:00', '2015-08-30 13:00:00', 'dave.miller@example.com', 28),
 ('Silent Storm', 'Boston', '2021-12-14 13:00:00', '2021-12-14 13:00:00', 'eve.davis@example.com', 30);

-- persons (10 records)
INSERT INTO public.persons (first_name, last_name, stage, birthday, artist_id, band_id, creation_date, last_updated, modified_by) VALUES
 ('Tom','Stone','Tommy','1990-01-01',1,1,'2025-01-01 14:00:00','2025-01-01 14:00:00', 'dave.miller@example.com'),
 ('Emma','Clark','Em','1990-01-02',4,2,'2025-01-02 14:00:00','2025-01-02 14:00:00', 'eve.davis@example.com'),
 ('Liam','Wright','Lee','1990-01-03',7,3,'2025-01-03 14:00:00','2025-01-03 14:00:00', 'frank.garcia@example.com'),
 ('Olivia','Walker','Livvy','1990-01-04',10,4,'2025-01-04 14:00:00','2025-01-04 14:00:00', 'grace.rodriguez@example.com'),
 ('Noah','Allen','Noey','1990-01-05',11,5,'2025-01-05 14:00:00','2025-01-05 14:00:00', 'heidi.wilson@example.com'),
 ('Ava','Young','Avie','1990-01-06',13,6,'2025-01-06 14:00:00','2025-01-06 14:00:00', 'john.smith@example.com'),
 ('Elijah','Hill','Eli','1990-01-07',15,7,'2025-01-07 14:00:00','2025-01-07 14:00:00', NULL),
 ('Isabella','Scott','Bella','1990-01-08',17,8,'2025-01-08 14:00:00','2025-01-08 14:00:00', NULL),
 ('Lucas','Green','Luke','1990-01-09',19,9,'2025-01-09 14:00:00','2025-01-09 14:00:00', NULL),
 ('Mia','Adams','M','1990-01-10',20,10,'2025-01-10 14:00:00','2025-01-10 14:00:00', NULL),
 ('Michael', 'Jordan', 'MJ', '1985-05-15', 23, 1, '2018-03-15 14:00:00', '2018-03-15 14:00:00', 'john.smith@example.com'),
 ('Sarah', 'Connor', 'Sara', '1988-07-22', 26, 2, '2019-06-01 14:00:00', '2019-06-01 14:00:00', 'jane.johnson@example.com'),
 ('David', 'Bowie', 'Bowie', '1991-01-08', 29, 3, '2020-09-22 14:00:00', '2020-09-22 14:00:00', 'alice.williams@example.com'),
 ('Carlos', 'Santana', 'Carlos', '1978-04-12', 8, 8, '2025-01-11 14:00:00', '2025-01-11 14:00:00', 'john.smith@example.com'),
 ('Elena', 'Rodriguez', 'Elena', '1982-09-25', 8, 8, '2025-01-11 14:05:00', '2025-01-11 14:05:00', 'john.smith@example.com'),
 ('Oliver', 'Winter', 'Ollie', '1989-12-15', 9, 9, '2025-01-12 14:00:00', '2025-01-12 14:00:00', 'jane.johnson@example.com'),
 ('Sophia', 'Frost', 'Sophie', '1991-01-30', 9, 9, '2025-01-12 14:05:00', '2025-01-12 14:05:00', 'jane.johnson@example.com'),
 ('Dusk', 'Tilldawn', 'Dusk', '1985-07-20', 10, 10, '2025-01-13 14:00:00', '2025-01-13 14:00:00', 'alice.williams@example.com'),
 ('Aurora', 'Borealis', 'Aurora', '1987-11-10', 10, 10, '2025-01-13 14:05:00', '2025-01-13 14:05:00', 'alice.williams@example.com'),
 ('Mike', 'Drums', 'Mikey', '1990-03-15', 1, 1, '2025-01-14 14:00:00', '2025-01-14 14:00:00', 'bob.brown@example.com'),
 ('Sarah', 'Strings', 'Sare', '1988-05-22', 2, 2, '2025-01-14 14:05:00', '2025-01-14 14:05:00', 'bob.brown@example.com'),
 ('DJ', 'Sunny', 'Sunny', '1987-08-10', 3, 3, '2025-01-14 14:10:00', '2025-01-14 14:10:00', 'carol.jones@example.com'),
 ('Marina', 'Blue', 'Rina', '1992-04-05', 4, 4, '2025-01-14 14:15:00', '2025-01-14 14:15:00', 'carol.jones@example.com'),
 ('Cliff', 'High', 'Cliffy', '1986-09-18', 5, 5, '2025-01-14 14:20:00', '2025-01-14 14:20:00', 'dave.miller@example.com'),
 ('Urban', 'Night', 'Urby', '1993-02-28', 6, 6, '2025-01-14 14:25:00', '2025-01-14 14:25:00', 'dave.miller@example.com'),
 ('Sandy', 'Dunes', 'San', '1984-11-15', 7, 7, '2025-01-14 14:30:00', '2025-01-14 14:30:00', 'eve.davis@example.com'),
 ('Star', 'Light', 'Stella', '1990-06-20', 11, 11, '2025-01-14 14:35:00', '2025-01-14 14:35:00', 'eve.davis@example.com'),
 ('Nova', 'Bright', 'Novi', '1989-10-12', 11, 11, '2025-01-14 14:40:00', '2025-01-14 14:40:00', 'frank.garcia@example.com'),
 ('Echo', 'Night', 'Echo', '1983-07-07', 12, 12, '2025-01-15 14:00:00', '2025-01-15 14:00:00', 'grace.rodriguez@example.com'),
 ('Midnight', 'Star', 'Midi', '1985-12-12', 12, 12, '2025-01-15 14:05:00', '2025-01-15 14:05:00', 'grace.rodriguez@example.com'),
 ('Volt', 'Current', 'Volty', '1987-03-25', 13, 13, '2025-01-15 14:10:00', '2025-01-15 14:10:00', 'heidi.wilson@example.com'),
 ('Amp', 'Power', 'Amps', '1989-05-15', 13, 13, '2025-01-15 14:15:00', '2025-01-15 14:15:00', 'heidi.wilson@example.com'),
 ('Neon', 'Glow', 'Neo', '1991-08-30', 14, 14, '2025-01-15 14:20:00', '2025-01-15 14:20:00', 'john.smith@example.com'),
 ('Light', 'Bright', 'Lite', '1990-10-20', 14, 14, '2025-01-15 14:25:00', '2025-01-15 14:25:00', 'john.smith@example.com'),
 ('Harmony', 'Chord', 'Harm', '1986-04-15', 15, 15, '2025-01-15 14:30:00', '2025-01-15 14:30:00', 'jane.johnson@example.com'),
 ('Melody', 'Tune', 'Mel', '1988-06-22', 15, 15, '2025-01-15 14:35:00', '2025-01-15 14:35:00', 'jane.johnson@example.com'),
 ('Cosmo', 'Space', 'Cos', '1984-09-18', 16, 16, '2025-01-15 14:40:00', '2025-01-15 14:40:00', 'alice.williams@example.com'),
 ('Galaxy', 'Star', 'Gala', '1987-11-30', 16, 16, '2025-01-15 14:45:00', '2025-01-15 14:45:00', 'alice.williams@example.com'),
 ('Urban', 'Myth', 'Urby', '1989-02-15', 17, 17, '2025-01-15 14:50:00', '2025-01-15 14:50:00', 'bob.brown@example.com'),
 ('Legend', 'Tale', 'Leggy', '1991-05-20', 17, 17, '2025-01-15 14:55:00', '2025-01-15 14:55:00', 'bob.brown@example.com'),
 ('Storm', 'Quiet', 'Stormy', '1985-07-25', 18, 18, '2025-01-15 15:00:00', '2025-01-15 15:00:00', 'carol.jones@example.com'),
 ('Silence', 'Peace', 'Sil', '1988-10-10', 18, 18, '2025-01-15 15:05:00', '2025-01-15 15:05:00', 'carol.jones@example.com');

-- songs (30 records)
INSERT INTO public.songs (title, duration, creation_date, last_updated, modified_by, album_id) VALUES
 ('Song A','03:30','2025-01-01 15:00:00','2025-01-01 15:00:00', 'eve.davis@example.com',1),
 ('Song A2','04:00','2025-01-01 15:10:00','2025-01-01 15:10:00', 'eve.davis@example.com',1),
 ('Song B','04:15','2025-01-02 15:00:00','2025-01-02 15:00:00', 'frank.garcia@example.com',2),
 ('Song B2','03:45','2025-01-02 15:10:00','2025-01-02 15:10:00', 'frank.garcia@example.com',2),
 ('Song C','02:45','2025-01-03 15:00:00','2025-01-03 15:00:00', 'grace.rodriguez@example.com',3),
 ('Song C2','03:15','2025-01-03 15:10:00','2025-01-03 15:10:00', 'grace.rodriguez@example.com',3),
 ('Song D','05:00','2025-01-04 15:00:00','2025-01-04 15:00:00', 'heidi.wilson@example.com',4),
 ('Song D2','04:20','2025-01-04 15:10:00','2025-01-04 15:10:00', 'heidi.wilson@example.com',4),
 ('Song E','03:20','2025-01-05 15:00:00','2025-01-05 15:00:00', 'john.smith@example.com',5),
 ('Song E2','03:50','2025-01-05 15:10:00','2025-01-05 15:10:00', 'john.smith@example.com',5),
 ('Song F','04:00','2025-01-06 15:00:00','2025-01-06 15:00:00', NULL,6),
 ('Song F2','03:30','2025-01-06 15:10:00','2025-01-06 15:10:00', NULL,6),
 ('Song G','03:50','2025-01-07 15:00:00','2025-01-07 15:00:00', NULL,7),
 ('Song G2','04:10','2025-01-07 15:10:00','2025-01-07 15:10:00', NULL,7),
 ('Song H','04:30','2025-01-08 15:00:00','2025-01-08 15:00:00', NULL,8),
 ('Song H2','03:25','2025-01-08 15:10:00','2025-01-08 15:10:00', NULL,8),
 ('Song I','02:55','2025-01-09 15:00:00','2025-01-09 15:00:00', NULL,9),
 ('Song I2','03:40','2025-01-09 15:10:00','2025-01-09 15:10:00', NULL,9),
 ('Song J','03:40','2025-01-10 15:00:00','2025-01-10 15:00:00', NULL,10),
 ('Song J2','04:05','2025-01-10 15:10:00','2025-01-10 15:10:00', NULL,10),
 ('Song K','03:30','2025-01-11 15:00:00','2025-01-11 15:00:00', 'alice.williams@example.com',11),
 ('Song L','04:00','2025-01-12 15:00:00','2025-01-12 15:00:00', 'bob.brown@example.com',12),
 ('Song M','03:15','2025-01-13 15:00:00','2025-01-13 15:00:00', 'carol.jones@example.com',13),
 ('Song N','04:20','2025-01-14 15:00:00','2025-01-14 15:00:00', 'dave.miller@example.com',14),
 ('Song O','03:50','2025-01-15 15:00:00','2025-01-15 15:00:00', 'eve.davis@example.com',15),
 ('Song P','03:25','2025-01-16 15:00:00','2025-01-16 15:00:00', 'frank.garcia@example.com',16),
 ('Song Q','04:10','2025-01-17 15:00:00','2025-01-17 15:00:00', 'grace.rodriguez@example.com',17),
 ('Song R','03:30','2025-01-18 15:00:00','2025-01-18 15:00:00', NULL,18),
 ('Song S','04:00','2025-01-19 15:00:00','2025-01-19 15:00:00', NULL,19),
 ('Song T','03:45','2025-01-20 15:00:00','2025-01-20 15:00:00', NULL,20),
 ('Midnight Melody', '04:15', '2025-03-01 15:00:00', '2025-03-01 15:00:00', 'john.smith@example.com', 21),
 ('Late Night Blues', '03:50', '2025-03-01 15:10:00', '2025-03-01 15:10:00', 'john.smith@example.com', 21),
 ('Dream Sequence', '05:20', '2025-03-02 15:00:00', '2025-03-02 15:00:00', 'jane.johnson@example.com', 22),
 ('Electric Pulse', '04:45', '2025-03-02 15:10:00', '2025-03-02 15:10:00', 'jane.johnson@example.com', 22),
 ('Acoustic Morning', '03:30', '2025-03-03 15:00:00', '2025-03-03 15:00:00', 'alice.williams@example.com', 23),
 ('Wooden Chair', '04:10', '2025-03-03 15:10:00', '2025-03-03 15:10:00', 'alice.williams@example.com', 23),
 ('Neon Glow', '03:55', '2025-03-04 15:00:00', '2025-03-04 15:00:00', 'bob.brown@example.com', 24),
 ('City Lights', '04:25', '2025-03-04 15:10:00', '2025-03-04 15:10:00', 'bob.brown@example.com', 24),
 ('Forgotten Track', '03:20', '2025-03-05 15:00:00', '2025-03-05 15:00:00', 'carol.jones@example.com', 25),
 ('Rare Gem', '04:15', '2025-03-05 15:10:00', '2025-03-05 15:10:00', 'carol.jones@example.com', 25),
 ('Crowd Chant', '04:30', '2025-03-06 15:00:00', '2025-03-06 15:00:00', 'dave.miller@example.com', 26),
 ('Encore Performance', '05:10', '2025-03-06 15:10:00', '2025-03-06 15:10:00', 'dave.miller@example.com', 26),
 ('String Theory', '03:45', '2025-03-07 15:00:00', '2025-03-07 15:00:00', 'eve.davis@example.com', 27),
 ('Piano Sonata', '04:50', '2025-03-07 15:10:00', '2025-03-07 15:10:00', 'eve.davis@example.com', 27),
 ('Featuring You', '03:55', '2025-03-08 15:00:00', '2025-03-08 15:00:00', 'frank.garcia@example.com', 28),
 ('Duet', '04:20', '2025-03-08 15:10:00', '2025-03-08 15:10:00', 'frank.garcia@example.com', 28),
 ('First Try', '03:10', '2025-03-09 15:00:00', '2025-03-09 15:00:00', 'grace.rodriguez@example.com', 29),
 ('Early Demo', '04:05', '2025-03-09 15:10:00', '2025-03-09 15:10:00', 'grace.rodriguez@example.com', 29),
 ('Classic Redux', '04:15', '2025-03-10 15:00:00', '2025-03-10 15:00:00', 'heidi.wilson@example.com', 30),
 ('Remastered Hit', '03:50', '2025-03-10 15:10:00', '2025-03-10 15:10:00', 'heidi.wilson@example.com', 30),
 ('Bonus Track 1', '03:30', '2025-03-11 15:00:00', '2025-03-11 15:00:00', NULL, 21),
 ('Bonus Track 2', '04:00', '2025-03-11 15:10:00', '2025-03-11 15:10:00', NULL, 22),
 ('Live Bonus', '05:15', '2025-03-12 15:00:00', '2025-03-12 15:00:00', NULL, 23),
 ('Acoustic Bonus', '03:45', '2025-03-12 15:10:00', '2025-03-12 15:10:00', NULL, 24),
 ('Neon Outtake', '04:20', '2025-03-13 15:00:00', '2025-03-13 15:00:00', NULL, 25),
 ('B-Side Special', '03:55', '2025-03-13 15:10:00', '2025-03-13 15:10:00', NULL, 26),
 ('Encore Bonus', '04:30', '2025-03-14 15:00:00', '2025-03-14 15:00:00', NULL, 27),
 ('Instrumental Outtake', '03:40', '2025-03-14 15:10:00', '2025-03-14 15:10:00', NULL, 28),
 ('Collaboration Demo', '04:10', '2025-03-15 15:00:00', '2025-03-15 15:00:00', NULL, 29),
 ('Early Version', '03:50', '2025-03-15 15:10:00', '2025-03-15 15:10:00', NULL, 30),
 ('Song A3','03:45','2025-01-01 15:20:00','2025-01-01 15:20:00', 'eve.davis@example.com',1),
 ('Song A4','04:10','2025-01-01 15:30:00','2025-01-01 15:30:00', 'eve.davis@example.com',1),
 ('Song A5','03:55','2025-01-01 15:40:00','2025-01-01 15:40:00', 'eve.davis@example.com',1),
 ('Song B3','04:25','2025-01-02 15:20:00','2025-01-02 15:20:00', 'frank.garcia@example.com',2),
 ('Song B4','03:35','2025-01-02 15:30:00','2025-01-02 15:30:00', 'frank.garcia@example.com',2),
 ('Song C3','03:05','2025-01-03 15:20:00','2025-01-03 15:20:00', 'grace.rodriguez@example.com',3),
 ('Song C4','02:50','2025-01-03 15:30:00','2025-01-03 15:30:00', 'grace.rodriguez@example.com',3),
 ('Song D3','05:30','2025-01-04 15:20:00','2025-01-04 15:20:00', 'heidi.wilson@example.com',4),
 ('Song D4','04:45','2025-01-04 15:30:00','2025-01-04 15:30:00', 'heidi.wilson@example.com',4),
 ('Song E3','03:40','2025-01-05 15:20:00','2025-01-05 15:20:00', 'john.smith@example.com',5),
 ('Song E4','04:15','2025-01-05 15:30:00','2025-01-05 15:30:00', 'john.smith@example.com',5);

-- playlist_song (30 records)
INSERT INTO public.playlist_song (playlist_id, song_id, song_order) VALUES
 (1,1,1),(1,9,2),(1,7,3),
 (2,2,1),(2,10,2),
 (3,3,1),(3,8,2),
 (4,4,1),(4,6,2),
 (5,5,1),(5,7,2),
 (6,6,1),(6,8,2),
 (7,7,1),(7,9,2),
 (8,8,1),(8,10,2),
 (9,9,1),(9,1,2),
 (10,10,1),(10,2,2),
 (11,11,1),(11,12,2),(11,13,3),
 (12,14,1),(12,15,2),
 (13,16,1),(13,17,2),
 (14,18,1),(14,19,2),
 (15,20,1),(15,21,2),
 (16,22,1),(16,23,2),
 (17,24,1),(17,25,2),
 (18,26,1),(18,27,2),
 (19,28,1),(19,29,2),
 (20,30,1),(20,1,2),(20,2,3),
 (1, 3, 4), (1, 5, 5),
 (2, 4, 3), (2, 6, 4),
 (3, 7, 3), (3, 9, 4),
 (4, 8, 3), (4, 10, 4),
 (5, 11, 3), (5, 13, 4),
 (1, 31, 6), (1, 32, 7), (1, 33, 8),
 (2, 34, 5), (2, 35, 6), (2, 36, 7),
 (3, 37, 5), (3, 38, 6), (3, 39, 7),
 (4, 40, 5), (4, 41, 6), (4, 42, 7),
 (5, 43, 5), (5, 44, 6), (5, 45, 7),
 (6, 46, 5), (6, 47, 6), (6, 48, 7),
 (7, 49, 5), (7, 50, 6), (7, 51, 7),
 (8, 52, 5), (8, 53, 6), (8, 54, 7),
 (9, 55, 5), (9, 56, 6), (9, 57, 7),
 (10, 58, 5), (10, 59, 6), (10, 60, 7),
 (11, 31, 4), (11, 33, 5), (11, 35, 6),
 (12, 37, 4), (12, 39, 5), (12, 41, 6),
 (13, 43, 4), (13, 45, 5), (13, 47, 6),
 (14, 49, 4), (14, 51, 5), (14, 53, 6),
 (1,61,9),(1,62,10),(1,63,11),
 (2,64,8),(2,65,9),
 (3,66,8),(3,67,9),
 (4,68,8),(4,69,9),
 (5,70,8),(5,71,9);

-- alternative_titles (30 records)
INSERT INTO public.alternative_titles (title, language, song_id) VALUES
-- English songs with English alternative titles (song_id 1-10)
('Song One', 'en', 1),
('Canción A', 'es', 1),
('Song Two', 'en', 2),
('Canción A2', 'es', 2),
('Song B', 'en', 3),
('Chanson B', 'fr', 3),
('Song B Two', 'en', 4),
('Chanson B2', 'fr', 4),
('Song C', 'en', 5),
('Lied C', 'de', 5),

-- English songs with various language alternatives (song_id 11-20)
('Song C Two', 'en', 6),
('Lied C2', 'de', 6),
('Song D', 'en', 7),
('歌 D', 'jp', 7),
('Song D Two', 'en', 8),
('歌 D2', 'jp', 8),
('Song E', 'en', 9),
('Canción E', 'es', 9),
('Song E Two', 'en', 10),
('Canción E2', 'es', 10),

-- More songs with language alternatives (song_id 21-30)
('Midnight Melody', 'en', 31),
('Melodía de Medianoche', 'es', 31),
('Late Night Blues', 'en', 32),
('Blues de Noche Tarde', 'es', 32),
('Dream Sequence', 'en', 33),
('Séquence de Rêve', 'fr', 33),
('Electric Pulse', 'en', 34),
('Pouls Électrique', 'fr', 34),
('Acoustic Morning', 'en', 35),
('Akustischer Morgen', 'de', 35),

-- Continuing with language alternatives (song_id 31-40)
('Wooden Chair', 'en', 36),
('Holzstuhl', 'de', 36),
('Neon Glow', 'en', 37),
('ネオングロー', 'jp', 37),
('City Lights', 'en', 38),
('Lumières de la Ville', 'fr', 38),
('Forgotten Track', 'en', 39),
('Pista Olvidada', 'es', 39),
('Rare Gem', 'en', 40),
('Pierre Rare', 'fr', 40),

-- More songs with alternatives (song_id 41-50)
('Crowd Chant', 'en', 41),
('Canto de la Multitud', 'es', 41),
('Encore Performance', 'en', 42),
('Auftrittszugabe', 'de', 42),
('String Theory', 'en', 43),
('Teoría de Cuerdas', 'es', 43),
('Piano Sonata', 'en', 44),
('ソナタピアノ', 'jp', 44),
('Featuring You', 'en', 45),
('Mit Dir', 'de', 45),

-- Final set of alternatives (song_id 51-60)
('Duet', 'en', 46),
('二重唱', 'jp', 46),
('First Try', 'en', 47),
('Premier Essai', 'fr', 47),
('Early Demo', 'en', 48),
('Demo Temprana', 'es', 48),
('Classic Redux', 'en', 49),
('Reducción Clásica', 'es', 49),
('Remastered Hit', 'en', 50),
('Hit Remasterizado', 'es', 50),

-- Bonus tracks with alternatives
('Bonus Track 1', 'en', 51),
('Pista Extra 1', 'es', 51),
('Bonus Track 2', 'en', 52),
('Piste Bonus 2', 'fr', 52),
('Live Bonus', 'en', 53),
('Bonus en Direct', 'fr', 53),
('Acoustic Bonus', 'en', 54),
('アコースティックボーナス', 'jp', 54),
('Neon Outtake', 'en', 55),
('Neon-Ausschnitt', 'de', 55),
('B-Side Special', 'en', 56),
('Spécial Face B', 'fr', 56),
('Encore Bonus', 'en', 57),
('Bonus da Bis', 'it', 57),
('Instrumental Outtake', 'en', 58),
('Instrumentalauszug', 'de', 58),
('Collaboration Demo', 'en', 59),
('Démo de Collaboration', 'fr', 59),
('Early Version', 'en', 60),
('Versión Temprana', 'es', 60),

 ('Song Three', 'en', 61),
 ('Canción A3', 'es', 61),
 ('Song Four', 'en', 62),
 ('Canción A4', 'es', 62),
 ('Song Five', 'en', 63),
 ('Canción A5', 'es', 63),
 ('Song B Three', 'en', 64),
 ('Chanson B3', 'fr', 64),
 ('Song B Four', 'en', 65),
 ('Chanson B4', 'fr', 65),
 ('Song C Three', 'en', 66),
 ('Lied C3', 'de', 66),
 ('Song C Four', 'en', 67),
 ('Lied C4', 'de', 67),
 ('Song D Three', 'en', 68),
 ('歌 D3', 'jp', 68),
 ('Song D Four', 'en', 69),
 ('歌 D4', 'jp', 69),
 ('Song E Three', 'en', 70),
 ('Canción E3', 'es', 70),
 ('Song E Four', 'en', 71),
 ('Canción E4', 'es', 71);


-- song_artist (30 records)
INSERT INTO public.song_artist (song_id, artist_id) VALUES
 (1,1),(2,1),(3,2),(4,2),(5,3),(6,3),(7,4),(8,4),(9,5),(10,5),
 (11,6),(12,6),(13,7),(14,7),(15,8),(16,8),(17,9),(18,9),(19,10),(20,10),
 (21,11),(22,12),(23,13),(24,14),(25,15),(26,16),(27,17),(28,18),(29,19),(30,20),
 (1, 21), (3, 22), (5, 23), (7, 24), (9, 25),
 (11, 26), (13, 27), (15, 28), (17, 29), (19, 30),
 (31, 11), (32, 12), (33, 13), (34, 14), (35, 15),
 (36, 16), (37, 17), (38, 18), (39, 19), (40, 20),
 (41, 21), (42, 22), (43, 23), (44, 24), (45, 25),
 (46, 26), (47, 27), (48, 28), (49, 29), (50, 30),
 (51, 1), (52, 2), (53, 3), (54, 4), (55, 5),
 (56, 6), (57, 7), (58, 8), (59, 9), (60, 10),
 (61,1),(62,1),(63,1),(64,2),(65,2),(66,3),(67,3),(68,4),(69,4),(70,5),(71,5);