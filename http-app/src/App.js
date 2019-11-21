import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import http from "./services/httpService";
import config from "./config.json";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    // pending > resolved (success) OR rejected (failure)
    // await word gets result of promise
    //need to put async in method signature in componentDidMount
    const { data: posts } = await http.get(config.apiEndpoint);

    this.setState({ posts });
  }

  //property for a function
  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await http.post(config.apiEndpoint, obj);

    const posts = [post, ...this.state.posts];
    this.setState({ posts });

    console.log(post);
  };

  handleUpdate = async post => {
    post.title = "UPDATED";

    //Put to update entire post
    await http.put(config.apiEndpoint + "/" + post.id);

    //Clone posts array
    const posts = [...this.state.posts];

    //Find index of post in array to update
    const index = posts.indexOf(post);

    //Create new object in post array at specific index
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async post => {
    const originalPosts = this.state.posts;

    //Get object with all posts except the one that you deleted
    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({ posts });

    //Optimistic update
    //1. Keep reference of original state
    //2. Update UI before call to server
    //3. Wrap call to server in try catch block

    try {
      await http.delete(config.apiEndpoint + "/" + post.id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        alert("This post has already been deleted");
      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
