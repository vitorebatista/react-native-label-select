/**
 * Created by TinySymphony on 2017-01-03.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Styles from './LabelSelectStyle';

class LabelSelect extends Component {
  static propTypes = {
    title: PropTypes.string,
    readOnly: PropTypes.bool,
    enable: PropTypes.bool,
    onConfirm: PropTypes.func,
    enableAddBtn: PropTypes.bool,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string
  }
  static defaultProps = {
    style: {},
    customStyle: {},
    title: '',
    enable: true,
    readOnly: false,
    onConfirm: () => {},
    enableAddBtn: true,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  }
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      isModalVisible: false
    };
    this.selectedList = [];
    this.toggleSelect = this.toggleSelect.bind(this);
    this.cancelSelect = this.cancelSelect.bind(this);
    this.confirmSelect = this.confirmSelect.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  setModalVisible(isVisible) {
    this.setState({ isModalVisible: isVisible });
  }
  cancelSelect() {
    this.selectedList = [];
    this.setModalVisible(false);
  }
  confirmSelect() {
    const { onConfirm } = this.props;
    onConfirm(this.selectedList);
    this.selectedList = [];
    this.cancelSelect();
  }
  openModal() {
    if (!React.Children.toArray(this.props.children).filter(item => item.type === ModalItem).length) {
      // TODO
    }
    this.props.enable && !this.props.readOnly && this.setModalVisible(true);
  }
  toggleSelect(time) {
    const index = this.selectedList.findIndex(item => item === time);
    if (~index) { this.selectedList.splice(index, 1); } else { this.selectedList.push(time); }
  }
  render() {
    const {
      readOnly,
      enable,
      title,
      style,
      enableAddBtn,
      customStyle,
      confirmText,
      cancelText
    } = this.props;
    const selectedLabels = React.Children.toArray(this.props.children)
      .filter(item => item.type === Label)
      .map((child) => {
        return React.cloneElement(child, {
          enable,
          readOnly
        });
      });

    const modalItems = this.state.isModalVisible ? React.Children.toArray(this.props.children)
      .filter(item => item.type === ModalItem)
      .map((child) => {
        return React.cloneElement(child, {
          toggleSelect: this.toggleSelect
        });
      }) : null;
    return (
      <View style={ [Styles.selectedView, style] }>
        {selectedLabels}
        {enable && !readOnly && enableAddBtn
          && <TouchableOpacity
            style={ [Styles.selectedItem, Styles.addItem, customStyle.selectedItem] }
            underlayColor="transparent"
            onPress={ this.openModal }>
            <View style={ Styles.viewAddText }>
              <Text style={ Styles.addText }>+</Text>
            </View>
          </TouchableOpacity>
        }
        <Modal
          transparent
          visible={ this.state.isModalVisible }
          onRequestClose={ () => {} }>
          <View style={ { flex: 1 } }>
            <TouchableOpacity
              style={ Styles.modalMask }
              activeOpacity={ 1 }
              underlayColor="#00000077"
              onPress={ this.cancelSelect }>
              <View style={ Styles.modalContainer }>
                <View style={ [Styles.modal, customStyle.modal || {}] }>
                  {title.length > 0
                    ? <View style={ Styles.title }><Text style={ Styles.titleText }>{title}</Text></View>
                    : <View />
                  }
                  <View style={ Styles.scrollView }>
                    <ScrollView>
                      {modalItems}
                    </ScrollView>
                  </View>
                  <View style={ [Styles.buttonView, customStyle.buttonView || {}] }>
                    <TouchableOpacity
                      underlayColor="transparent"
                      activeOpacity={ 0.8 }
                      onPress={ this.cancelSelect }>
                      <View style={ [Styles.modalButton, customStyle.cancelButton || {}] }>
                        <Text style={ [Styles.buttonText, customStyle.cancelText || {}] }>{cancelText}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      underlayColor="transparent"
                      activeOpacity={ 0.8 }
                      onPress={ this.confirmSelect }>
                      <View style={ [Styles.modalButton, Styles.confirmButton, customStyle.confirmButton || {}] }>
                        <Text style={ [Styles.buttonText, customStyle.confirmText || {}] }>{confirmText}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

class Label extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    readOnly: PropTypes.bool,
    enable: PropTypes.bool
  }
  static defaultProps = {
    onCancel: () => {},
    enable: true,
    readOnly: false,
    customStyle: {}
  }
  render() {
    const { enable, readOnly, onCancel, customStyle } = this.props;
    return (
      <View style={ [Styles.selectedItem, !enable && Styles.disableColor, customStyle.selectedItem] }>
        <Text
          style={ [Styles.labelText, !enable && Styles.disableText, customStyle.text || {}] }
          numberOfLines={ 1 }
          ellipsisMode="tail">{this.props.children}</Text>
        {enable && !readOnly && <TouchableOpacity
          style={ [Styles.closeContainer, customStyle.closeContainer] }
          underlayColor="transparent"
          activeOpacity={ 0.5 }
          onPress={ onCancel }>
          <View style={ Styles.viewClose }>
            <Text style={ Styles.textClose }>X</Text>
          </View>
        </TouchableOpacity>}
      </View>
    );
  }
}

class ModalItem extends Component {
  static propTypes = {
    toggleSelect: PropTypes.func
  }
  static defaultProps = {
    customStyle: {}
  }
  constructor(props) {
    super(props);
    this.isSelected = false;
    this._toggleSelect = this._toggleSelect.bind(this);
  }
  _toggleSelect() {
    const { toggleSelect, data } = this.props;
    this.isSelected = !this.isSelected;
    this.forceUpdate();
    toggleSelect(data);
  }
  render() {
    const {
      customStyle
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        underlayColor="transparent"
        onPress={ this._toggleSelect }>
        <View style={ Styles.modalItem }>
          <Text
            style={ [Styles.modalText, customStyle.modalText || {}] }
            numberOfLines={ 1 }
            ellipsisMode="tail">
            {this.props.children}
          </Text>
          <View style={ [Styles.outerCircle, this.isSelected ? Styles.enableCircle : {}, customStyle.outerCircle || {}] }>
            {this.isSelected && <View style={ [Styles.innerCircle, customStyle.innerCircle || {}] } />}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

LabelSelect.Label = Label;
LabelSelect.ModalItem = ModalItem;

export default LabelSelect;
