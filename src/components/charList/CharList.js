import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        loadingMore: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequestLoad();
    }

    onRequestLoad = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            loadingMore: true
        });
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            loadingMore: false,
            offset: offset + 9,
            charEnded: ended,
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderCharList(arrChar) {
        const items = arrChar.map((item, i) => {
            const { id, thumbnail, name } = item;

            let thumbnailClassList;

            thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? 
                thumbnailClassList = 'randomchar__img contain' : thumbnailClassList = 'randomchar__img';

            return (
                <li 
                    className="char__item" 
                    key={id} onClick={() => {
                        this.props.onCharSelected(id);
                        this.focusOnItem(i);
                    }}
                    tabIndex={0}
                    ref={this.setRef}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(id);
                            this.focusOnItem(i);
                        }
                    }}
                    >
                    <img src={thumbnail} alt={name} className={thumbnailClassList} />
                    <div className="char__name">{name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, loadingMore, offset, charEnded } = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = this.renderCharList(charList);

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={loadingMore}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequestLoad(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;