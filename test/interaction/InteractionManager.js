'use strict';

const MockPointer = require('./MockPointer');

describe('PIXI.interaction.InteractionManager', function ()
{
    describe('event basics', function ()
    {
        it('should call mousedown handler', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const eventSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('mousedown', eventSpy);

            pointer.mousedown(10, 10);

            expect(eventSpy).to.have.been.calledOnce;
        });

        it('should call mouseup handler', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const eventSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('mouseup', eventSpy);

            pointer.click(10, 10);

            expect(eventSpy).to.have.been.called;
        });

        it('should call mouseupoutside handler', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const eventSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('mouseupoutside', eventSpy);

            pointer.mousedown(10, 10);
            pointer.mouseup(60, 60);

            expect(eventSpy).to.have.been.called;
        });

        it('should call mouseover handler', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const eventSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('mouseover', eventSpy);

            pointer.mousemove(10, 10);

            expect(eventSpy).to.have.been.called;
        });

        it('should call mouseout handler', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const eventSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('mouseout', eventSpy);

            pointer.mousemove(10, 10);
            pointer.mousemove(60, 60);

            expect(eventSpy).to.have.been.called;
        });
    });

    describe('onClick', function ()
    {
        it('should call handler when inside', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const clickSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('click', clickSpy);

            pointer.click(10, 10);

            expect(clickSpy).to.have.been.calledOnce;
        });

        it('should not call handler when outside', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const clickSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('click', clickSpy);

            pointer.click(60, 60);

            expect(clickSpy).to.not.have.been.called;
        });
    });

    describe('onTap', function ()
    {
        it('should call handler when inside', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const clickSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('tap', clickSpy);

            pointer.tap(10, 10);

            expect(clickSpy).to.have.been.calledOnce;
        });

        it('should not call handler when outside', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const clickSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.on('tap', clickSpy);

            pointer.tap(60, 60);

            expect(clickSpy).to.not.have.been.called;
        });
    });

    describe('overlapping children', function ()
    {
        function getScene(callbackEventName)
        {
            const behindChild = new PIXI.Graphics();
            const frontChild = new PIXI.Graphics();
            const parent = new PIXI.Container();
            const behindChildCallback = sinon.spy();
            const frontChildCallback = sinon.spy();
            const parentCallback = sinon.spy();

            behindChild.beginFill(0xFF);
            behindChild.drawRect(0, 0, 50, 50);
            behindChild.on(callbackEventName, behindChildCallback);

            frontChild.beginFill(0x00FF);
            frontChild.drawRect(0, 0, 50, 50);
            frontChild.on(callbackEventName, frontChildCallback);

            parent.addChild(behindChild, frontChild);
            parent.on(callbackEventName, parentCallback);

            return {
                behindChild,
                frontChild,
                parent,
                behindChildCallback,
                frontChildCallback,
                parentCallback,
            };
        }

        describe('when parent is non-interactive', function ()
        {
            describe('when both children are interactive', function ()
            {
                it('should callback front child when clicking front child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(10, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.not.have.been.called;
                });

                it('should callback front child when clicking overlap', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(40, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.not.have.been.called;
                });

                it('should callback behind child when clicking behind child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(60, 10);

                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.behindChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.not.have.been.called;
                });
            });

            describe('when front child is non-interactive', function ()
            {
                it('should not callback when clicking front child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;

                    stage.addChild(scene.parent);
                    pointer.click(10, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.parentCallback).to.not.have.been.called;
                });

                it('should callback behind child when clicking overlap', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;

                    stage.addChild(scene.parent);
                    pointer.click(40, 10);

                    expect(scene.behindChildCallback).to.have.been.calledOnce;
                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.parentCallback).to.not.have.been.called;
                });

                it('should callback behind child when clicking behind child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;

                    stage.addChild(scene.parent);
                    pointer.click(60, 10);

                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.behindChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.not.have.been.called;
                });
            });

            describe('when behind child is non-interactive', function ()
            {
                it('should callback front child when clicking front child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(10, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.not.have.been.called;
                });

                it('should callback front child when clicking overlap', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(40, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.not.have.been.called;
                });

                it('should not callback when clicking behind child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(60, 10);

                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.parentCallback).to.not.have.been.called;
                });
            });
        });

        describe('when parent is interactive', function ()
        {
            describe('when both children are interactive', function ()
            {
                it('should callback parent and front child when clicking front child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(10, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });

                it('should callback parent and front child when clicking overlap', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(40, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });

                it('should callback parent and behind child when clicking behind child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(60, 10);

                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.behindChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });
            });

            describe('when front child is non-interactive', function ()
            {
                it('should callback parent when clicking front child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(10, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });

                /* TODO: Fix #3596
                it('should callback parent and behind child when clicking overlap', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(40, 10);

                    expect(scene.behindChildCallback).to.have.been.calledOnce;
                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });
                */

                it('should callback parent and behind child when clicking behind child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.interactive = true;
                    scene.behindChild.x = 25;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(60, 10);

                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.behindChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });
            });

            describe('when behind child is non-interactive', function ()
            {
                it('should callback parent and front child when clicking front child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(10, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });

                it('should callback parent and front child when clicking overlap', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(40, 10);

                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.frontChildCallback).to.have.been.calledOnce;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });

                it('should callback parent when clicking behind child', function ()
                {
                    const stage = new PIXI.Container();
                    const pointer = new MockPointer(stage);
                    const scene = getScene('click');

                    scene.behindChild.x = 25;
                    scene.frontChild.interactive = true;
                    scene.parent.interactive = true;

                    stage.addChild(scene.parent);
                    pointer.click(60, 10);

                    expect(scene.frontChildCallback).to.not.have.been.called;
                    expect(scene.behindChildCallback).to.not.have.been.called;
                    expect(scene.parentCallback).to.have.been.calledOnce;
                });
            });
        });
    });

    describe('cursor changes', function ()
    {
        it('cursor should be the cursor of interactive item', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.cursor = 'help';
            pointer.interaction.cursorStyles.help = 'help';

            pointer.mousemove(10, 10);

            expect(pointer.renderer.view.style.cursor).to.equal('help');
        });

        it('should return cursor to default on mouseout', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.cursor = 'help';
            pointer.interaction.cursorStyles.help = 'help';

            pointer.mousemove(10, 10);
            pointer.mousemove(60, 60);

            expect(pointer.renderer.view.style.cursor).to.equal(pointer.interaction.cursorStyles.default);
        });

        it('should still be the over cursor after a click', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.cursor = 'help';
            pointer.interaction.cursorStyles.help = 'help';

            pointer.mousemove(10, 10);
            pointer.click(10, 10);

            expect(pointer.renderer.view.style.cursor).to.equal('help');
        });

        it('should return cursor to default when mouse leaves renderer', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.cursor = 'help';
            pointer.interaction.cursorStyles.help = 'help';

            pointer.mousemove(10, 10);
            pointer.mousemove(-10, 60);

            expect(pointer.renderer.view.style.cursor).to.equal(pointer.interaction.cursorStyles.default);
        });

        it('cursor callback should be called', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const overSpy = sinon.spy();
            const defaultSpy = sinon.spy();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.cursor = 'help';
            pointer.interaction.cursorStyles.help = overSpy;
            pointer.interaction.cursorStyles.default = defaultSpy;

            pointer.mousemove(10, 10);
            pointer.mousemove(60, 60);

            expect(overSpy).to.have.been.called;
            expect(defaultSpy).to.have.been.called;
        });

        it('cursor style object should be fully applied', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.cursor = 'help';
            pointer.interaction.cursorStyles.help = {
                cursor: 'none',
                display: 'none',
            };

            pointer.mousemove(10, 10);

            expect(pointer.renderer.view.style.cursor).to.equal('none');
            expect(pointer.renderer.view.style.display).to.equal('none');
        });

        it('should not change cursor style if no cursor style provided', function ()
        {
            const stage = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            const pointer = new MockPointer(stage);

            stage.addChild(graphics);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 50, 50);
            graphics.interactive = true;
            graphics.cursor = 'pointer';
            pointer.interaction.cursorStyles.pointer = null;
            pointer.interaction.cursorStyles.default = null;

            pointer.mousemove(10, 10);
            expect(pointer.renderer.view.style.cursor).to.equal('');

            pointer.mousemove(60, 60);
            expect(pointer.renderer.view.style.cursor).to.equal('');
        });
    });

    describe('recursive hitTesting', function ()
    {
        function getScene()
        {
            const stage = new PIXI.Container();
            const behindChild = new PIXI.Graphics();
            const middleChild = new PIXI.Graphics();
            const frontChild = new PIXI.Graphics();

            behindChild.beginFill(0xFF);
            behindChild.drawRect(0, 0, 50, 50);

            middleChild.beginFill(0xFF00);
            middleChild.drawRect(0, 0, 50, 50);

            frontChild.beginFill(0xFF0000);
            frontChild.drawRect(0, 0, 50, 50);

            stage.addChild(behindChild, middleChild, frontChild);

            return {
                behindChild,
                middleChild,
                frontChild,
                stage,
            };
        }

        describe('when frontChild is interactive', function ()
        {
            it('should stop hitTesting after first hit', function ()
            {
                const scene = getScene();
                const pointer = new MockPointer(scene.stage);
                const frontHitTest = sinon.spy(scene.frontChild, 'containsPoint');
                const middleHitTest = sinon.spy(scene.middleChild, 'containsPoint');
                const behindHitTest = sinon.spy(scene.behindChild, 'containsPoint');

                scene.frontChild.interactive = true;
                scene.middleChild.interactive = true;
                scene.behindChild.interactive = true;

                pointer.mousedown(25, 25);

                expect(frontHitTest).to.have.been.calledOnce;
                expect(middleHitTest).to.not.have.been.called;
                expect(behindHitTest).to.not.have.been.called;
            });
        });

        describe('when frontChild is not interactive', function ()
        {
            it('should stop hitTesting after first hit', function ()
            {
                const scene = getScene();
                const pointer = new MockPointer(scene.stage);
                const frontHitTest = sinon.spy(scene.frontChild, 'containsPoint');
                const middleHitTest = sinon.spy(scene.middleChild, 'containsPoint');
                const behindHitTest = sinon.spy(scene.behindChild, 'containsPoint');

                scene.frontChild.interactive = false;
                scene.middleChild.interactive = true;
                scene.behindChild.interactive = true;

                pointer.mousedown(25, 25);

                expect(frontHitTest).to.not.have.been.called;
                expect(middleHitTest).to.have.been.calledOnce;
                expect(behindHitTest).to.not.have.been.called;
            });
        });
    });
});
