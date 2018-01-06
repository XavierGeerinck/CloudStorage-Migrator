import React from "react";
import PropTypes from "prop-types";
import * as API from "../../../../providers/microsoft/api";
import "./style.css";

class FolderView extends React.Component {
  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    onAuthError: PropTypes.func,
    onSelectFolder: PropTypes.func
  };

  static defaultProps = {
    onAuthError: err => {},
    onSelectFolder: (name, id) => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      currentItem: {
        name: "root",
        id: "root"
      },
      parentItems: [],
      items: []
    };
  }

  componentDidMount() {
    API.getFolders("root")
      .then(data =>
        this.setState({
          items: data.value.map(file => ({
            name: file.name,
            id: file.id // The google id!
          }))
        })
      )
      .catch(err => this.props.onAuthError(err));
  }

  onClick(name, id) {
    console.log(`Clicked folder ${name} with id ${id}`);

    // We need to remove an item
    let parentItems = this.state.parentItems;
    if (name === "..") {
      // Call our callback so that we can see which folder has been selected
      this.props.onSelectFolder({
        id: parentItems[parentItems.length - 1].id,
        name: parentItems[parentItems.length - 1].name
      });

      parentItems.pop();
    } else {
      parentItems.push({
        id: this.state.currentItem.id,
        name: this.state.currentItem.name
      });

      // Call our callback so that we can see which folder has been selected
      this.props.onSelectFolder({
        id: id,
        name: name
      });
    }

    API.getFolders(id)
      .then(data =>
        this.setState({
          currentItem: {
            name,
            id
          },
          parentItems,
          items: data.value.map(file => ({
            name: file.name,
            id: file.id // The google id!
          }))
        })
      )
      .catch(err => this.props.onAuthError(err));
  }

  render() {
    const { items, parentItems } = this.state;

    return (
      <div className="OneDrive-FolderExplorer" style={{ flex: 1 }}>
        {parentItems.length > 0 && (
          <FolderItem
            onClick={(name, id) => this.onClick(name, id)}
            key={`folder_${parentItems[parentItems.length - 1].id}`}
            name={".."}
            id={parentItems[parentItems.length - 1].id}
          />
        )}
        {items && items.map(i => <FolderItem onClick={(name, id) => this.onClick(name, id)} key={`folder_${i.id}`} name={i.name} id={i.id} />)}
      </div>
    );
  }
}

class FolderItem extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: (name, id) => {}
  };

  render() {
    const { name, id } = this.props;
    return (
      <div className="OneDrive-FolderExplorer-Folder" onClick={e => this.props.onClick(name, id)}>
        <img src={require("./folder.svg")} />
        <span>{name}</span>
      </div>
    );
  }
}

export default FolderView;
