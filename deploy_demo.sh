DEMO_DIR=../rodant-demo/
PUBLIC_URL=$DEMO_DIR npm run build
cp -r build/* $DEMO_DIR
git -C  $DEMO_DIR add --all
git -C $DEMO_DIR commit -m 'Update demo'
git -C $DEMO_DIR push
