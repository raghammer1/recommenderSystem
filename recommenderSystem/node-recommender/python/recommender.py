# import sys
# import pandas as pd
# import matplotlib.pyplot as plt
# import json

# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances

# from pymongo import MongoClient

# import json


# client = MongoClient("mongodb://localhost:27017/")
# print("Connected to MongoDB")

# db = client["movieDB"]
# # print("Selected database:", db)

# collection = db["movies"]
# # print("Selected collection:", collection)

# # # Print the total count of documents in the collection
# # print("Total movies in collection:", collection.count_documents({}))

# # # Print all documents in the collection
# # for movie in collection.find():
# #     print(movie)

# # a = sys.argv[1]

# movies_data = list(collection.find())

# # Convert the list of dictionaries to a DataFrame
# df = pd.DataFrame(movies_data)
# movie2idx = pd.Series(df.index, index=df["title"])


# def genre_keywords_to_string(row):
#     genres = json.loads(row["genres"])
#     genres = " ".join("".join(gen["name"].split()) for gen in genres)

#     keywords = json.loads(row["keywords"])
#     keywords = " ".join("".join(keyw["name"].split()) for keyw in keywords)

#     return "%s %s" % (genres, keywords)


# df["string"] = df.apply(genre_keywords_to_string, axis=1)

# tfidf = TfidfVectorizer(max_features=2000)
# X = tfidf.fit_transform(df["string"])

# # print(df.head())


# # c = a + b

# # print(c)


# def rec(title):
#     # getting the row in db for this particular movie:
#     idx = movie2idx[title]
#     if type(idx) == pd.Series:
#         idx = idx.iloc[0]

#     # Calculate pairwise similarity for this movie
#     query = X[idx]
#     scores = cosine_similarity(query, X)

#     # Currently array is 1xN make it just 1D array
#     scores = scores.flatten()

#     # get recommendation for first n movies
#     recommended_idx = (-scores).argsort()[1:6]

#     # return titles of the recommended movies
#     return df["title"].iloc[recommended_idx].to_json()


# # print(rec(a))


# # sys.stdout.flush()


# from flask import Flask, jsonify, request
# from flask_cors import CORS

# # Import other necessary modules

# app = Flask(__name__)
# CORS(app)

# # Your existing setup and functions here, modified to fit within the Flask app structure


# @app.route("/recommend", methods=["GET"])
# def recommend():
#     # return jsonify({"status": "success", "data": "Test response"}), 200

#     title = request.args.get("title", "")
#     if title:
#         try:
#             recommendations = rec(
#                 title
#             )  # Assuming rec returns a list of recommendations
#             return jsonify({"status": "success", "data": recommendations}), 200
#         except Exception as e:
#             return jsonify({"status": "error", "message": str(e)}), 500
#     else:
#         return jsonify({"status": "error", "message": "No title provided"}), 400


# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=5001)
import sys
import pandas as pd
import matplotlib.pyplot as plt
import json

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances

from pymongo import MongoClient

import json

# MongoDB Atlas connection URI
username = "syna-agarwal"
password = "Q8qJKwX5acZnjTUk"
cluster_url = "cluster0.e3sde.mongodb.net"
db_name = "movieDB"

# Create the MongoDB Atlas connection URI
uri = f"mongodb+srv://{username}:{password}@{cluster_url}/{db_name}?retryWrites=true&w=majority"

client = MongoClient(uri)
print("Connected to MongoDB Atlas")

db = client[db_name]
collection = db["movies"]

movies_data = list(collection.find())

# Convert the list of dictionaries to a DataFrame
df = pd.DataFrame(movies_data)
movie2idx = pd.Series(df.index, index=df["title"])


def genre_keywords_to_string(row):
    genres = json.loads(row["genres"])
    genres = " ".join("".join(gen["name"].split()) for gen in genres)

    keywords = json.loads(row["keywords"])
    keywords = " ".join("".join(keyw["name"].split()) for keyw in keywords)

    return "%s %s" % (genres, keywords)


df["string"] = df.apply(genre_keywords_to_string, axis=1)

tfidf = TfidfVectorizer(max_features=2000)
X = tfidf.fit_transform(df["string"])


def rec(title):
    # getting the row in db for this particular movie:
    idx = movie2idx[title]
    if type(idx) == pd.Series:
        idx = idx.iloc[0]

    # Calculate pairwise similarity for this movie
    query = X[idx]
    scores = cosine_similarity(query, X)

    # Currently array is 1xN make it just 1D array
    scores = scores.flatten()

    # get recommendation for first n movies
    recommended_idx = (-scores).argsort()[1:6]

    # return titles of the recommended movies
    return df["title"].iloc[recommended_idx].to_json()


from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/recommend", methods=["GET"])
def recommend():
    title = request.args.get("title", "")
    if title:
        try:
            recommendations = rec(title)
            return jsonify({"status": "success", "data": recommendations}), 200
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "No title provided"}), 400


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
