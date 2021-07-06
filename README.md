
# WeLoveMovies REST API

WeLoveMovies is an RESTful API that utilizes an SQL database to provide users access to data about movies, theaters, and reviews.

## Installation

- From command line:

```bash
npm install 
```
- Configure .env file to connect to SQL database
- To run migrations: 
```bash
npx knex migrate:latest
```
- To run seeds: 
```bash
npx knex seed:run
```


## Tables in Migrations
### Critics

The `critics` table represents movie critics who have created reviews for movies. Each critic has the following fields:

- `critic_id`: (Primary Key) A unique ID for the critic.
- `preferred_name`: (String) The critic's preferred first name.
- `surname`: (String) The critic's last name.
- `organization_name`: (String) The name of the organization the critic works for.

### Movies-Theaters

The `movies_theaters` table is a join table that connects movies with theaters. It represents which movies are being shown in which theaters. It also includes a key that represents whether or not a movie is currently showing at the theater, or if it has in the past.

- `movie_id`: (Foreign Key) A reference ID to a particular movie.
- `theater_id`: (Foreign Key) A reference ID to a particular theater.
- `is_showing`: (Boolean) A representation of whether or not the movie is currently showing in the referenced theater.

### Movies

The `movies` table represents movies stored in the application database. Each movie has the following fields:

- `movie_id`: (Primary Key) A unique ID for the movie.
- `title`: (String) The title of the movie.
- `runtime_in_minutes`: (Integer) The length of the movie in minutes.
- `rating`: (String) The rating given to the movie.
- `description`: (Text) A shortened description of the movie.
- `image_url`: (String) A URL to the movie's poster.

An example record looks like the following:

### Reviews

The `reviews` table represents a review done by a critic of a single movie. It references both a critic and a movie.

- `review_id`: (Primary Key) A unique ID for the review.
- `content`: (Text) The content of the review, written in markdown.
- `score`: (Integer) A numerical representation of the score given to the movie by the critic.
- `critic_id`: (Foreign Key) A reference ID to a particular critic.
- `movie_id`: (Foreign Key) A reference ID to a particular movie.

### Theaters

The `theaters` table represents movie theaters. Each theater has the following fields:

- `theater_id`: (Primary Key) A unique ID for the theater.
- `name`: (String) The name of the theater.
- `address_line_1`: (String) The first line of the address of the theater.
- `address_line_2`: (String) The second line of the address of the theater.
- `city`: (String) The city in which the theater is located.
- `state`: (String) The state in which the theater is located.
- `zip`: (String) The zip in which the theater is located.

____________________________________________

## Usage

### GET /movies

The response from the server will look like the following:


```json
{
  "data": [
    {
      "id": 1,
      "title": "Spirited Away",
      "runtime_in_minutes": 125,
      "rating": "PG",
      "description": "Chihiro ...",
      "image_url": "https://imdb-api.com/..."
    }
    // ...
  ]
}
```
### GET /movies?is_showing=true


In the event where `is_showing=true` is provided, the route will return only those movies where the movie is currently showing in theaters.

### GET /movies/:movieId/theaters

This route should return all the `theaters` where the movie is playing. 

The response from the server for a request to `/movies/1/theaters` should look like the following.

```json
{
  "data": [
    {
      "theater_id": 2,
      "name": "Hollywood Theatre",
      "address_line_1": "4122 NE Sandy Blvd.",
      "address_line_2": "",
      "city": "Portland",
      "state": "OR",
      "zip": "97212",
      "created_at": "2021-02-23T20:48:13.342Z",
      "updated_at": "2021-02-23T20:48:13.342Z",
      "is_showing": true,
      "movie_id": 1
    }
    // ...
  ]
}
```

### GET /movies/:movieId/reviews

The response from the server for a request to `/movies/1/reviews` should look like the following.

```json
{
  "data": [
    {
      "review_id": 1,
      "content": "Lorem markdownum ...",
      "score": 3,
      "created_at": "2021-02-23T20:48:13.315Z",
      "updated_at": "2021-02-23T20:48:13.315Z",
      "critic_id": 1,
      "movie_id": 1,
      "critic": {
        "critic_id": 1,
        "preferred_name": "Chana",
        "surname": "Gibson",
        "organization_name": "Film Frenzy",
        "created_at": "2021-02-23T20:48:13.308Z",
        "updated_at": "2021-02-23T20:48:13.308Z"
      }
    }
    // ...
  ]
}
```

### DELETE /reviews/:reviewId (incorrect ID)

This route will delete a review by ID. If the ID is incorrect, a `404` will be returned.

### PUT /reviews/:reviewId

This route will allow you to partially or fully update a review. If the ID is incorrect, a `404` will be returned.
A body like the following should be passed along with the request:

```json
{
  "score": 3,
  "content": "New content..."
}
```

The response should include the entire review record with the newly patched content, and the critic information set to the `critic` property.

```json
{
  "data": {
    "review_id": 1,
    "content": "New content...",
    "score": 3,
    "created_at": "2021-02-23T20:48:13.315Z",
    "updated_at": "2021-02-23T20:48:13.315Z",
    "critic_id": 1,
    "movie_id": 1,
    "critic": {
      "critic_id": 1,
      "preferred_name": "Chana",
      "surname": "Gibson",
      "organization_name": "Film Frenzy",
      "created_at": "2021-02-23T20:48:13.308Z",
      "updated_at": "2021-02-23T20:48:13.308Z"
    }
  }
}
```
### GET /theaters


This route should return all the `theaters` and, the movies playing at each theatre added to the `movies` key. 

The response from the server should look like the following.

```json
{
  "data": [
    {
      "theater_id": 1,
      "name": "Regal City Center",
      "address_line_1": "801 C St.",
      "address_line_2": "",
      "city": "Vancouver",
      "state": "WA",
      "zip": "98660",
      "created_at": "2021-02-23T20:48:13.335Z",
      "updated_at": "2021-02-23T20:48:13.335Z",
      "movies": [
        {
          "movie_id": 1,
          "title": "Spirited Away",
          "runtime_in_minutes": 125,
          "rating": "PG",
          "description": "Chihiro...",
          "image_url": "https://imdb-api.com...",
          "created_at": "2021-02-23T20:48:13.342Z",
          "updated_at": "2021-02-23T20:48:13.342Z",
          "is_showing": false,
          "theater_id": 1
        }
        // ...
      ]
    }
    // ...
  ]
}
```
