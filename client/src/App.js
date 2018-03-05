import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AddButton from 'material-ui/svg-icons/content/add'
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import validUrl from 'valid-url';
import _ from 'lodash';

class App extends Component {

  

  constructor(props){
    super(props)
    this.state = {
      urls: [],
      tableOptions: {
        showCheckboxes: false,
        displayBorder: true
      },
      appBarOptions: {
        showMenuIconButton: false
      },
      newUrl: '',
      modalOpen: false
    }
    this.handleUrlUpdate = this.handleUrlUpdate.bind(this)
    this.handleUrlSubmit = this.handleUrlSubmit.bind(this)
  }

  componentDidMount() {

    axios.get('urls')
      .then(res => {
        console.log(res.data.data)
        this.setState({ urls: res.data.data })
      })
  }

  handleDelete(id) {
    let urls = this.state.urls
    _.remove(urls, {id: id})
    this.setState({
      urls: urls
    })
    axios.delete(`urls/${id}`)
      .then(res => {
        console.log(res.data)
      })
  }

  handleUrlUpdate(event, id) {
    let urls = this.state.urls
    let matchUrl = _.find(urls, {id: id})
    matchUrl.url = event.target.value

    this.setState({
      urls: urls
    })
  }

  handleUrlSubmit(id) {
    let updatedUrl = _.find(this.state.urls, {id: id})
    if (validUrl.is_http_uri(_.find(this.state.urls, {id: id}).url) || validUrl.is_https_uri(_.find(this.state.urls, {id: id}).url) || !_.find(this.state.urls, {id: id}).url) {
      axios.put(`urls/${id}`, {"url": updatedUrl.url})
      .then(res => {
        console.log(res.data)
      })
    }
  }

  handleModalOpen = () => {
    this.setState({modalOpen: true, newUrl: ''});
  };

  handleModalClose = () => {
    this.setState({modalOpen: false});
  };

  handleModalSubmit = () => {
    if (this.state.newUrl) {
      axios.post('urls', {'url': this.state.newUrl})
      .then(res => {
        let urls = this.state.urls
        urls.push({id: res.data.data.id, url: res.data.data.url})
        this.setState({
          urls: urls,
          modalOpen: false
        })
      })
    }
  }

  handleNewUrlUpdate = (event) => {
    this.setState({
      newUrl: event.target.value
    })
  }

  render() {

    const modalActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleModalClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleModalSubmit}
      />,
    ];

    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="TinyURL"
            showMenuIconButton = {this.state.appBarOptions.showMenuIconButton}
            iconElementRight = {<IconButton><AddButton /></IconButton>}
            onRightIconButtonClick = {this.handleModalOpen}
          />
          <Table
          >
            <TableHeader
              displaySelectAll = {this.state.tableOptions.showCheckboxes}
            >
              <TableRow>
                <TableHeaderColumn>Short URL</TableHeaderColumn>
                <TableHeaderColumn>Long URL</TableHeaderColumn>
                <TableHeaderColumn>Action</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
            displayRowCheckbox = {this.state.tableOptions.showCheckboxes}
            >
            {
              this.state.urls.map((url) => {
                return (
                    <TableRow 
                      key={url.id}
                      displayBorder = {this.state.tableOptions.displayBorder}
                    >
                      <TableRowColumn>
                        <FlatButton 
                          label={'http://localhost:3001/s/' + url.id} 
                          labelStyle={{textTransform: 'inherit'}}
                          href={'http://localhost:3001/s/' + url.id} 
                          target = "_blank"
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <TextField
                          value={url.url}
                          name={'text-' + url.id}
                          onChange={(event) => this.handleUrlUpdate(event, url.id)}  
                          errorText={validUrl.is_http_uri(_.find(this.state.urls, {id: url.id}).url) || validUrl.is_https_uri(_.find(this.state.urls, {id: url.id}).url) || !_.find(this.state.urls, {id: url.id}).url ? null : 'Url is invalid'}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <FlatButton 
                          label="UPDATE" 
                          primary={true} 
                          onClick = {() => this.handleUrlSubmit(url.id)}
                        />
                        <FlatButton 
                        label="DELETE" 
                        secondary={true} 
                        onClick = {() => this.handleDelete(url.id)}
                      />
                      </TableRowColumn>
                    </TableRow>
                )
              })
            }
            </TableBody>
          </Table>
          <Dialog
            title="New URL to Shorten"
            actions={modalActions}
            modal={false}
            open={this.state.modalOpen}
            onRequestClose={this.handleModalClose}
          >
            <TextField
              value = {this.state.newUrl}
              onChange={(event) => this.handleNewUrlUpdate(event)}
              errorText={validUrl.is_http_uri(this.state.newUrl) || validUrl.is_https_uri(this.state.newUrl) || !this.state.newUrl ? null : 'Url is invalid'}
              name='newUrlTextField'
              fullWidth={true}
            />
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;