import React, { Component } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

/**
 * Confirmation dialog
 *
 * Example usage:
 * <ConfirmDialog
 *   title="Error"
 *   content="Confirm action?"
 *   onConfirm={() => this.doAction}
 *   onCancel={() => this.setState({ dialog: null })}
 * />
 */
export default class ConfirmDialog extends Component {
  render() {
    const { title, content, button = 'Ok', wrap, customRenderContent } = this.props;

    const contentStyle = wrap ? { whiteSpace: 'pre' } : {};

    const renderedContent = customRenderContent
      ? content
      : (
        <Typography>{content}</Typography>
      );

    return (
      <Dialog
        open={true}
        onClose={() => this.props.onCancel()}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <DialogContent style={contentStyle}>
          {renderedContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onCancel()} color='secondary'>
            {'Cancel'}
          </Button>
          <Button
            onClick={() => this.props.onConfirm()}
            color='primary'
            autoFocus={this.props.autoFocus}
          >
            {button}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
