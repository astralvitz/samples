import React from "react";
import './ProductRow.css';

export default class ProductRow extends React.Component {
    render() {
      const product = this.props.product;
      const name = product.stocked ?
        product.name :
        <span style={{color: 'red'}}>
          {product.name}
        </span>;
  
      return (
        <tr className="row">
          <td>{name}</td>
          <td>{product.price}</td>
        </tr>
      );
    }
  }