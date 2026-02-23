import { RegisterRequest } from "./interface";

export class MockData {
    static mockPersonArtist = {
        id: 1,
        type: 'PERSON',
        startDate: '2010-01-01',
        endDate: null,
        person: {
            firstName: 'John',
            lastName: 'Doe',
            stageName: 'John Doe',
            birthday: '1990-05-15'
        }
    };

    static mockBandArtist = {
        id: 2,
        type: 'BAND',
        startDate: '2005-03-10',
        endDate: null,
        band: {
            bandName: 'The Rock Stars',
            location: 'New York',
            members: [
                {
                    stageName: 'Johnny Rock',
                    firstName: 'John',
                    lastName: 'Smith',
                    birthday: '1985-08-20'
                },
                {
                    stageName: 'Mike Bass',
                    firstName: 'Michael',
                    lastName: 'Johnson',
                    birthday: '1987-12-03'
                }
            ]
        }
    };

    static mockAlbums = [
        {
            id: 1,
            title: 'Greatest Hits',
            genre: 'Rock',
            artist: { name: 'John Doe' },
            releaseDate: '2020-06-15'
        },
        {
            id: 2,
            title: 'Live Concert',
            genre: 'Rock',
            artist: { name: 'John Doe' },
            releaseDate: '2021-12-10'
        }
    ];
    static mockArtistSongs = [
        {
            title: 'Hit Song 1',
            artists: [{ name: 'John Doe' }],
            duration: '3:45'
        },
        {
            title: 'Hit Song 2',
            artists: [{ name: 'John Doe' }],
            duration: '4:20'
        }
    ];

    static mockArtists = [
        {
            id: 1,
            type: 'BAND',
            name: 'Band 1'
        },
        {
            id: 2,
            type: 'BAND',
            name: 'Band 2'
        },
        {
            id: 3,
            type: 'PERSON',
            name: 'Person 1'
        }
    ];

    static mockRegularUser = {
        id: 15,
        firstName: 'TestRegularUser',
        lastName: 'ForTesting',
        email: 'test.regular@example.com',
        country: 'TestCountry',
        role: 'REGULAR',
        isDeleted: false
    }

    static mockAdminUser = {
        id: 15,
        firstName: 'TestRegularUser',
        lastName: 'ForTesting',
        email: 'test.regular@example.com',
        country: 'TestCountry',
        role: 'REGULAR',
        isDeleted: false
    }

    static mockPlaylists: [
        { id: 1, name: 'Test Playlist', type: 'PUBLIC', owner: { id: 2, firstName: 'Alice', lastName: 'Doe' } }
    ];

    static mockRegister:RegisterRequest={
        firstName:'TestFirstName',
        lastName:'Test user',
        email: 'unset',
        country:'ro test',
        password: 'Ale12Bale123.!'
    }
}
