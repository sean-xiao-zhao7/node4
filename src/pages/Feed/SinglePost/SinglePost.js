import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
    state = {
        title: "",
        author: "",
        date: "",
        image: "",
        content: "",
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        const graphqlQuery = {
            query: `
                query {
                    getPost(id: "${postId}") {
                        _id
                        title
                        content
                        imageUrl
                        adder {
                            _id
                            username
                            name
                        }
                        createdAt
                        updatedAt
                    }
                }  
            `,
        };

        fetch("http://localhost:8080/graphql", {
            headers: {
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
            method: 'POST'
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                if (resData.errors && resData.errors[0].status !== 200) {
                    throw new Error("Failed to fetch status");
                }

                this.setState({
                    title: resData.data.getPost.title,
                    author: resData.data.getPost.adder.name,
                    date: new Date(resData.data.getPost.createdAt).toLocaleDateString("en-US"),
                    content: resData.data.getPost.content,
                    image: "http://localhost:8080/" + resData.data.getPost.imageUrl,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <section className="single-post">
                <h1>{this.state.title}</h1>
                <h2>
                    Created by {this.state.author} on {this.state.date}
                </h2>
                <div className="single-post__image">
                    <Image contain imageUrl={this.state.image} />
                </div>
                <p>{this.state.content}</p>
            </section>
        );
    }
}

export default SinglePost;
