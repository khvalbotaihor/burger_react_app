import React, {Component} from 'react'
import Aux from '../../hoc/Auxiliary/Auxilary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuilControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import axios from "../../axios-orders";


class BurgerBuilder extends Component {

    state = {
        purchasing: false,

    }

    componentDidMount() {
        console.log('props: ' + this.props);
        this.props.onInitIngredients();

    }

    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);
         return sum > 0}

   /* addIngredientHandler = (type) => {

        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients)

    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return
        }

        const updatedCounted = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCounted;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});


        this.updatePurchaseState(updatedIngredients)

    }
*/
    purchaseHandler = (props) => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = (props) => {
        this.setState({purchasing: false})
    }
    purchaseContinueHandler = (props) => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout')
    }


    render() {

        const disableInfo = {
            ...this.props.ings
        }
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;

        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemove}
                        disabled={disableInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        price={this.props.price}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                ingredients={this.props.ings}
                price={this.props.price}
            />
        }
        ;



        return (

            <Aux>

                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>

                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName)=> dispatch(actions.addIngredient(ingName)),
        onIngredientRemove: (ingName)=> dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: ()=> dispatch(actions.purchaseInit())
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));