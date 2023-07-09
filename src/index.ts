export const Greeter = (name: string) => `Hello ${name}`;

export const getCartItems = (store: string, quest: string, resolve: (result: object) => void) => {
  fetch('https://fingertipps.store/getcart', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
    body: JSON.stringify({
      ownId: quest,
      storeId: store,
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
  visitorId: string,
  storeId: string,
  item: { price: number; photos: Array<String>; _id: string; name: string; choosenSize: string; choosenColor: string },
  resolveFunction: (result: number) => void,
  errorCatcher: (result: string) => void,
) => {
  // const store = "644ecffe38fa62672d349ebd";
  // const quest = JSON.parse(localStorage.getItem("quest"));
  fetch('https://fingertipps.store/addtocart', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    body: JSON.stringify({
      owner: visitorId,
      price: item.price,
      photo: item.photos,
      count: 1,
      itemId: item._id,
      name: item.name,
      choosenSize: item.choosenSize,
      choosenColor: item.choosenColor,
      store: storeId,
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
  visitorId: string,
  storeId: string,
  item: { _id: string; name: string; choosenColor: string; choosenSize: string },
  resolve: () => void,
) => {
  // dispatch(inscreaseItemCount(item));
  fetch('https://fingertipps.store/increase', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    body: JSON.stringify({
      id: item._id,
      owner: visitorId,
      store: storeId,
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
  visitorId: string,
  storeId: string,
  item: { _id: string; name: string; choosenColor: string; choosenSize: string },
  resolve: () => void,
) => {
  fetch('https://fingertipps.store/decrease', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    body: JSON.stringify({
      id: item._id,
      owner: visitorId,
      store: storeId,
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
  visitorId: string,
  storeId: string,
  item: { _id: string; name: string; choosenColor: string; choosenSize: string },
  resolve: (data: number) => void,
) => {
  fetch('https://fingertipps.store/deleteCart', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    body: JSON.stringify({
      id: item._id,
      owner: visitorId,
      store: storeId,
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
  visitorId: string,
  storeId: string,
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

    fetch('https://fingertipps.store/conversations', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        senderId: visitorId,
        receiverId: storeId,
        total,
        reference,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        saveOrder(visitorId, storeId, result.convo._id, address, phoneNumber, email, name, total, itemsInCart, resolve);
        console.log(result);
      });
  };

  const saveOrder = (
    visitorId: string,
    storeId: string,
    conversationID: string,
    address: string,
    phoneNumber: number,
    email: string,
    name: string,
    total: number,
    itemsInCart: Array<object>,
    resolve: () => void,
  ) => {
    fetch('https://fingertipps.store/messages', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        sender: visitorId,
        reciever: storeId,
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
        clear(visitorId, storeId);
        resolve();
      });
  };

  const clear = (visitorId: string, storeId: string) => {
    fetch('https://fingertipps.store/clear', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        ownId: visitorId,
        storeId: storeId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
      });
  };

  submit();
};

export const SearchProducts = (
  storeId: string,
  searchQuery: string,
  resolve: (result: object) => void,
  page: number,
) => {
  fetch('https://fingertipps.store/search', {
    method: 'post',
    headers: {
      'content-Type': 'application/json',
    },
    body: JSON.stringify({
      search: searchQuery,
      id: storeId,
      page: page ? page : 1,
    }),
  })
    .then((res) => res.json())
    .then((results) => {
      console.log(results);
      resolve(results);
    })
    .catch((err) => {});
};

export const GetProducts = (storeId: string, page: number, resolve: (result: object) => void) => {
  fetch(`https://fingertipps.store/user/collection1/${storeId}`, {
    method: 'post',
    headers: {
      'content-Type': 'application/json',
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
