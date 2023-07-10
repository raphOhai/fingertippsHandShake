let Globalapikey: string = '';
let GlobalstoreId: string = '';
let GloabaluserId: string = '';

export const InitializeHandShake = (apikey: string, storeId: string, userId: string) => {
  Globalapikey = apikey;
  GloabaluserId = userId;
  GlobalstoreId = storeId;
};

export const getCartItems = (visitorId: string, resolve: (result: object) => void) => {
  fetch('https://fingertipps.store/dev/getcart', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + Globalapikey,
    },
    body: JSON.stringify({
      ownId: visitorId,
      storeId: GlobalstoreId,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      // console.log(result);
      resolve(result);
    })
    .catch((err) => {});
};

export const addToCart = (
  item: { price: number; photos: Array<String>; _id: string; name: string; choosenSize: string; choosenColor: string },
  resolveFunction: (result: number) => void,
  errorCatcher: (result: string) => void,
) => {
  // const store = "644ecffe38fa62672d349ebd";
  // const quest = JSON.parse(localStorage.getItem("quest"));
  fetch('https://fingertipps.store/dev/addtocart', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + Globalapikey,
    },
    body: JSON.stringify({
      owner: GloabaluserId,
      price: item.price,
      photo: item.photos,
      count: 1,
      itemId: item._id,
      name: item.name,
      choosenSize: item.choosenSize,
      choosenColor: item.choosenColor,
      // store: GlobalstoreId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        errorCatcher(data.error);
      } else {
        resolveFunction(data.cartCount);
      }
    })
    .catch((err) => {
      //   errorHandler;
    });
};

export const increaseItemCount = (
  item: { _id: string; name: string; choosenColor: string; choosenSize: string },
  resolve: () => void,
) => {
  // dispatch(inscreaseItemCount(item));
  fetch('https://fingertipps.store/dev/increase', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + Globalapikey,
    },
    body: JSON.stringify({
      id: item._id,
      owner: GloabaluserId,
      // store: GlobalstoreId,
      name: item.name,
      choosenColor: item.choosenColor,
      choosenSize: item.choosenSize,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      resolve();
    })
    .catch((err) => {});
};

export const decreaseItemCount = (
  item: { _id: string; name: string; choosenColor: string; choosenSize: string },
  resolve: () => void,
) => {
  fetch('https://fingertipps.store/dev/decrease', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + Globalapikey,
    },
    body: JSON.stringify({
      id: item._id,
      owner: GloabaluserId,
      // store: GlobalstoreId,
      name: item.name,
      choosenColor: item.choosenColor,
      choosenSize: item.choosenSize,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      resolve();
    })
    .catch((err) => {});
};

export const deleteSingleCartItem = (
  item: { _id: string; name: string; choosenColor: string; choosenSize: string },
  resolve: (data: number) => void,
) => {
  fetch('https://fingertipps.store/dev/deleteCart', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + Globalapikey,
    },
    body: JSON.stringify({
      id: item._id,
      owner: GloabaluserId,
      // store: GlobalstoreId,
      name: item.name,
      choosenColor: item.choosenColor,
      choosenSize: item.choosenSize,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        // console.log(' isIncart c error', data.error);
      } else {
        // setAdded(true);
        // setOpen(true);
        // setPush(false);
        // dispatch({ type: "CLR" });

        resolve(data.cartCount);
      }
    })
    .catch(() => {});
};

export const savePaymentRecord = (
  reference: string,
  total: number,
  address: string,
  name: string,
  email: string,
  phoneNumber: number,
  itemsInCart: Array<Object>,
  resolve: () => void,
) => {
  const submit = () => {
    // dispatch(closeModal());

    fetch('https://fingertipps.store/dev/conversations', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Globalapikey,
      },
      body: JSON.stringify({
        senderId: GloabaluserId,
        // receiverId: GlobalstoreId,
        total,
        reference,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        saveOrder(result.convo._id, address, phoneNumber, email, name, total, itemsInCart, resolve);
        console.log(result);
      });
  };

  const saveOrder = (
    conversationID: string,
    address: string,
    phoneNumber: number,
    email: string,
    name: string,
    total: number,
    itemsInCart: Array<object>,
    resolve: () => void,
  ) => {
    fetch('https://fingertipps.store/dev/messages', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Globalapikey,
      },
      body: JSON.stringify({
        sender: GloabaluserId,
        // reciever: GlobalstoreId,
        text: itemsInCart,
        conversationId: conversationID,
        address: address,
        number: phoneNumber,
        buyerEmail: email,
        total,
        name,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        clear();
        resolve();
      });
  };

  const clear = () => {
    fetch('https://fingertipps.store/dev/clear', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Globalapikey,
      },
      body: JSON.stringify({
        ownId: GloabaluserId,
        // storeId: GlobalstoreId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
      });
  };

  submit();
};

export const SearchProducts = (searchQuery: string, resolve: (result: object) => void, page: number) => {
  fetch('https://fingertipps.store/dev/search', {
    method: 'post',
    headers: {
      'content-Type': 'application/json',
      Authorization: 'Bearer ' + Globalapikey,
    },
    body: JSON.stringify({
      search: searchQuery,
      // id: GlobalstoreId,
      page: page ? page : 1,
    }),
  })
    .then((res) => res.json())
    .then((results) => {
      // console.log(results);
      resolve(results);
    })
    .catch((err) => {});
};

export const GetProducts = (page: number, resolve: (result: object) => void) => {
  fetch(`https://fingertipps.store/dev/user/collection1/`, {
    method: 'post',
    headers: {
      'content-Type': 'application/json',
      Authorization: 'Bearer ' + Globalapikey,
    },
    body: JSON.stringify({
      page: page,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {});
};
